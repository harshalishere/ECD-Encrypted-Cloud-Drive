from fastapi import APIRouter, Depends, HTTPException, Response, Body
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
from app.core.database import get_db
from app.api import deps
from app.models.user import File as FileModel, SharedLink
from app.services.s3 import S3Service
from app.services.encryption import FileEncryptor
from app.utils.hashing import Hash 

router = APIRouter(tags=["Share"])

# 1. Create Share Link (User Only)
@router.post("/share/create")
def create_share_link(
    data: dict = Body(...), # Expects {file_id: 1, password: "optional", expires_minutes: 60}
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    file_id = data.get("file_id")
    password = data.get("password")
    expires_minutes = data.get("expires_minutes")

    # Verify ownership
    file = db.query(FileModel).filter(FileModel.id == file_id, FileModel.owner_id == current_user.id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    # Generate unique hash (Safe URL string, e.g. "A7x9_d")
    unique_hash = secrets.token_urlsafe(5) 

    # Hash password if provided
    pwd_hash = Hash.bcrypt(password) if password else None

    # Calculate Expiration Time
    expires_at = datetime.utcnow() + timedelta(minutes=int(expires_minutes)) if expires_minutes else None

    new_link = SharedLink(
        file_id=file.id,
        unique_hash=unique_hash,
        password_hash=pwd_hash,
        expires_at=expires_at
    )
    db.add(new_link)
    db.commit()
    db.refresh(new_link)

    # Return the hash so frontend can build the URL
    return {"hash": unique_hash, "full_url": f"/share/{unique_hash}"}

# 2. Get Share Info (Public Access - No Login Required)
@router.get("/share/{unique_hash}/info")
def get_share_info(unique_hash: str, db: Session = Depends(get_db)):
    link = db.query(SharedLink).filter(SharedLink.unique_hash == unique_hash).first()
    
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
        
    # Check Expiration
    if link.expires_at and link.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Link expired")

    # Return public info (Don't reveal the key or location!)
    return {
        "filename": link.file.filename,
        "size": link.file.size,
        "is_protected": link.password_hash is not None,
        "upload_date": link.file.upload_date
    }

# 3. Download Shared File (Public Access - Password Protected)
@router.post("/share/{unique_hash}/download")
def download_shared_file(
    unique_hash: str, 
    password_data: dict = Body(default={}), # {password: "user-input"}
    db: Session = Depends(get_db)
):
    link = db.query(SharedLink).filter(SharedLink.unique_hash == unique_hash).first()
    
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    # Check Expiration
    if link.expires_at and link.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Link expired")

    # Verify Password (if one was set)
    if link.password_hash:
        input_pass = password_data.get("password", "")
        if not input_pass or not Hash.verify(input_pass, link.password_hash):
             raise HTTPException(status_code=401, detail="Incorrect Password")

    # Retrieve File
    file_record = link.file
    
    # S3 Download & Decrypt
    try:
        encrypted_data = S3Service.download_file(file_record.storage_path)
        
        key_bytes = bytes.fromhex(file_record.encryption_key)
        nonce_bytes = bytes.fromhex(file_record.nonce)
        
        encryptor = FileEncryptor(key_bytes)
        decrypted_data = encryptor.decrypt(encrypted_data, nonce_bytes)
        
        return Response(
            content=decrypted_data,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={file_record.filename}"}
        )
    except Exception as e:
        print(f"Share download error: {e}")
        raise HTTPException(status_code=500, detail="Download failed")