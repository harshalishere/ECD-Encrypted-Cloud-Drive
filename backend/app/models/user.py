from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship, backref
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    
    # Relationships
    files = relationship("File", back_populates="owner")
    folders = relationship("Folder", back_populates="owner")

class Folder(Base):
    __tablename__ = "folders"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    
    # Hierarchy: A folder can have a parent folder
    parent_id = Column(Integer, ForeignKey("folders.id"), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="folders")
    # This magic line allows "subfolders"
    subfolders = relationship("Folder", backref=backref('parent', remote_side=[id]))
    files = relationship("File", back_populates="folder")

class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_type = Column(String)
    size = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
    
    # Security Metadata
    encryption_key = Column(String) 
    nonce = Column(String)
    storage_path = Column(String)
    
    # Ownership & Location
    owner_id = Column(Integer, ForeignKey("users.id"))
    folder_id = Column(Integer, ForeignKey("folders.id"), nullable=True) # <--- NEW: File lives in a folder

    owner = relationship("User", back_populates="files")
    folder = relationship("Folder", back_populates="files")

class SharedLink(Base):
    __tablename__ = "shared_links"
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("files.id"))
    unique_hash = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=True) 
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    file = relationship("File")