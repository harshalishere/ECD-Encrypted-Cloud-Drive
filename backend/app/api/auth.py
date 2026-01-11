from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from jose import JWTError, jwt
from app.core.database import get_db
from app.models.user import User
from app.utils.hashing import Hash

router = APIRouter(tags=["Authentication"])

SECRET_KEY = "super-secret-fixed-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 Days

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 1. REGISTER
@router.post("/register")
def register(user_data: dict, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.email == user_data["email"]).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = User(
        email=user_data["email"],
        hashed_password=Hash.bcrypt(user_data["password"]),
        full_name=user_data.get("full_name", "User")
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Auto-login after register
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# 2. LOGIN
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Invalid Credentials")
    
    if not Hash.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=404, detail="Incorrect Password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}