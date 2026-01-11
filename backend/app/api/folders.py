from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api import deps
from app.models.user import Folder, File as FileModel

router = APIRouter(tags=["Folders"])

# 1. Create a New Folder
@router.post("/folders/create")
def create_folder(
    data: dict = Body(...), # Expects { "name": "Work Stuff", "parent_id": null }
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    name = data.get("name")
    parent_id = data.get("parent_id")
    
    if not name:
        raise HTTPException(status_code=400, detail="Folder name required")

    new_folder = Folder(
        name=name,
        parent_id=parent_id,
        owner_id=current_user.id
    )
    db.add(new_folder)
    db.commit()
    db.refresh(new_folder)
    
    return new_folder

# 2. Get Folder Contents (Files + Subfolders)
@router.get("/folders/content")
def get_folder_content(
    folder_id: int = None, # If None, get "Root" (Home)
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    # Get Subfolders in this location
    subfolders = db.query(Folder).filter(
        Folder.owner_id == current_user.id,
        Folder.parent_id == folder_id
    ).all()

    # Get Files in this location
    files = db.query(FileModel).filter(
        FileModel.owner_id == current_user.id,
        FileModel.folder_id == folder_id
    ).all()

    return {
        "folders": subfolders,
        "files": files,
        "current_folder_id": folder_id
    }