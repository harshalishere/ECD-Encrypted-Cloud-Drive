import os
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Response, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api import deps
from app.models.user import File as FileModel
from app.core.crypto_utils import CryptoUtils
from app.services.encryption import FileEncryptor
from app.services.s3 import S3Service

router = APIRouter(tags=["Files"])

# 1. UPLOAD
@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    folder_id: Optional[int] = Form(None),
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    # A. Read and Encrypt
    file_bytes = await file.read()
    
    salt = CryptoUtils.generate_salt()
    file_key = CryptoUtils.derive_key(str(current_user.id), salt)
    
    encryptor = FileEncryptor(file_key)
    encrypted_data, nonce = encryptor.encrypt(file_bytes)
    
    # B. S3 Upload
    safe_filename = f"enc_{CryptoUtils.encode_salt(salt)[:8]}_{file.filename}"
    S3Service.upload_file(encrypted_data, safe_filename)
    
    # C. Calculate Size
    size_mb = len(file_bytes) / (1024 * 1024)
    size_str = f"{size_mb:.2f} MB" if size_mb > 1 else f"{len(file_bytes)/1024:.2f} KB"

    # D. Save Metadata
    new_file = FileModel(
        filename=file.filename,
        file_type=file.filename.split('.')[-1] if '.' in file.filename else "unknown",
        size=size_str,
        encryption_key=file_key.hex(),
        nonce=nonce.hex(),
        storage_path=safe_filename,
        owner_id=current_user.id,
        folder_id=folder_id 
    )
    
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    
    return {"message": "File uploaded", "file_id": new_file.id}

# 2. LIST FILES
@router.get("/files")
def get_my_files(current_user = Depends(deps.get_current_user), db: Session = Depends(get_db)):
    return current_user.files

# 3. DOWNLOAD
@router.get("/files/{file_id}/download")
def download_file(
    file_id: int,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    file_record = db.query(FileModel).filter(
        FileModel.id == file_id, 
        FileModel.owner_id == current_user.id
    ).first()
    
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        encrypted_data = S3Service.download_file(file_record.storage_path)
    except:
        raise HTTPException(status_code=404, detail="File missing from Cloud Storage")

    try:
        key_bytes = bytes.fromhex(file_record.encryption_key)
        nonce_bytes = bytes.fromhex(file_record.nonce)
        
        encryptor = FileEncryptor(key_bytes)
        decrypted_data = encryptor.decrypt(encrypted_data, nonce_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Decryption failed")

    return Response(
        content=decrypted_data,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={file_record.filename}"}
    )

# 4. DELETE
@router.delete("/files/{file_id}")
def delete_file(
    file_id: int,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    file_record = db.query(FileModel).filter(
        FileModel.id == file_id, 
        FileModel.owner_id == current_user.id
    ).first()
    
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    S3Service.delete_file(file_record.storage_path)

    db.delete(file_record)
    db.commit()

    return {"message": "File deleted securely from Cloud"}

# 5. STORAGE STATS (NEW)
@router.get("/files/stats")
def get_storage_stats(current_user = Depends(deps.get_current_user), db: Session = Depends(get_db)):
    files = current_user.files
    total_bytes = 0.0
    
    # Categories
    type_sizes = {"Images": 0.0, "Documents": 0.0, "Videos": 0.0, "Audio": 0.0, "Others": 0.0}
    
    # Definition of types
    cat_map = {
        "Images": ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
        "Documents": ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'],
        "Videos": ['mp4', 'mov', 'avi', 'mkv', 'webm'],
        "Audio": ['mp3', 'wav', 'aac', 'ogg']
    }

    for f in files:
        # 1. Parse Size String (e.g. "5.20 MB" -> 5452595 bytes)
        try:
            val_str, unit = f.size.split()
            val = float(val_str)
            if unit.upper() == "KB": val *= 1024
            elif unit.upper() == "MB": val *= (1024 * 1024)
            elif unit.upper() == "GB": val *= (1024 * 1024 * 1024)
        except:
            val = 0
            
        total_bytes += val
        
        # 2. Categorize
        ext = f.filename.split('.')[-1].lower() if '.' in f.filename else "unknown"
        category = "Others"
        for cat, exts in cat_map.items():
            if ext in exts:
                category = cat
                break
        
        type_sizes[category] += val

    # Format for Frontend (Convert back to MB)
    chart_data = []
    for k, v in type_sizes.items():
        if v > 0:
            chart_data.append({"name": k, "value": round(v / (1024 * 1024), 2)}) # in MB

    return {
        "total_used_mb": round(total_bytes / (1024 * 1024), 2),
        "file_count": len(files),
        "chart_data": chart_data
    }