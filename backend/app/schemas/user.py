from pydantic import BaseModel, EmailStr

# 1. Registration Data (In)
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

# 2. Login Data (In)
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# 3. User Response (Out) - No Password!
class UserShow(BaseModel):
    full_name: str
    email: EmailStr
    class Config:
        from_attributes = True

# 4. Token Response (Out)
class Token(BaseModel):
    access_token: str
    token_type: str