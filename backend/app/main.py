from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import auth, files, share  

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ECD - Encrypted Cloud Drive",
    description="Zero-knowledge encrypted storage API",
    version="1.0.0"
)

# ... (CORS middleware stays the same) ...
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(files.router)
app.include_router(share.router) # <--- 2. Add this line

@app.get("/")
def read_root():
    return {"message": "Welcome to ECD Secure Backend", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# ... other imports
from app.api import auth, files, share, folders # <--- Import folders

# ...

app.include_router(auth.router)
app.include_router(files.router)
app.include_router(folders.router) # <--- Register it
app.include_router(share.router)