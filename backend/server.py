from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import json
import shutil
from datetime import datetime, timedelta
import jwt
import bcrypt
import secrets
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# File-based storage directories
DATA_DIR = ROOT_DIR / 'data'
UPLOADS_DIR = ROOT_DIR / 'uploads'
PHOTOS_DIR = UPLOADS_DIR / 'photos'
RESUMES_DIR = UPLOADS_DIR / 'resumes'

# Create directories if they don't exist
for directory in [DATA_DIR, UPLOADS_DIR, PHOTOS_DIR, RESUMES_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Files
PORTFOLIO_FILE = DATA_DIR / 'portfolio.json'
ADMIN_FILE = DATA_DIR / 'admin.json'

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# JWT settings
SECRET_KEY = os.environ.get('SECRET_KEY', secrets.token_hex(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# File upload limits
MAX_PHOTO_SIZE = 5 * 1024 * 1024  # 5MB
MAX_RESUME_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_PHOTO_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
ALLOWED_RESUME_EXTENSIONS = {'.pdf', '.doc', '.docx'}

security = HTTPBearer()

# Define Models
class PersonalInfo(BaseModel):
    name: str = ""
    title: str = ""
    photo: Optional[str] = None

class Skill(BaseModel):
    name: str
    level: Optional[str] = None

class Experience(BaseModel):
    title: str
    company: str
    duration: str
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None

class Project(BaseModel):
    name: str
    description: str
    technologies: Optional[List[str]] = None
    link: Optional[str] = None

class Education(BaseModel):
    degree: str
    institution: str
    year: str
    gpa: Optional[str] = None

class Contact(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

class Settings(BaseModel):
    theme: str = "modern-professional"
    photoPosition: str = "top-right"
    llmProvider: str = "openai"
    llmApiKey: Optional[str] = None

class Portfolio(BaseModel):
    personalInfo: PersonalInfo
    skills: List[Any] = []
    experience: List[Any] = []
    projects: List[Any] = []
    education: List[Any] = []
    contact: Dict[str, Any] = {}
    settings: Optional[Settings] = Settings()

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUser(BaseModel):
    username: str
    password_hash: str

# Helper functions
def load_json_file(file_path: Path, default: Any = None):
    if file_path.exists():
        with open(file_path, 'r') as f:
            return json.load(f)
    return default if default is not None else {}

def save_json_file(file_path: Path, data: Any):
    # Write to temp file first, then rename for atomic operation
    temp_file = file_path.with_suffix('.tmp')
    with open(temp_file, 'w') as f:
        json.dump(data, f, indent=2)
    temp_file.replace(file_path)

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def validate_file_extension(filename: str, allowed_extensions: set) -> bool:
    """Validate file extension"""
    ext = Path(filename).suffix.lower()
    return ext in allowed_extensions

def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename using UUID"""
    ext = Path(original_filename).suffix.lower()
    return f"{uuid.uuid4()}{ext}"

# Initialize default admin user if not exists
def init_admin():
    admin_data = load_json_file(ADMIN_FILE)
    if not admin_data:
        default_admin = {
            "username": "admin",
            "password_hash": hash_password("admin123")
        }
        save_json_file(ADMIN_FILE, default_admin)
        logging.info("Default admin user created. Please change the password!")

init_admin()

# Routes
@api_router.get("/")
async def root():
    return {"message": "3D Portfolio API", "version": "1.0.0"}

@api_router.post("/admin/login")
async def admin_login(login: AdminLogin):
    admin_data = load_json_file(ADMIN_FILE)
    if not admin_data or admin_data.get('username') != login.username:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(login.password, admin_data.get('password_hash', '')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": login.username})
    return {"token": access_token, "token_type": "bearer"}

@api_router.get("/portfolio")
async def get_portfolio():
    portfolio_data = load_json_file(PORTFOLIO_FILE, default={
        "personalInfo": {"name": "", "title": "", "photo": None},
        "skills": [],
        "experience": [],
        "projects": [],
        "education": [],
        "contact": {},
        "settings": {
            "theme": "modern-professional",
            "photoPosition": "top-right",
            "llmProvider": "openai",
            "llmApiKey": None
        }
    })
    # Remove sensitive data from response
    if 'settings' in portfolio_data and 'llmApiKey' in portfolio_data['settings']:
        portfolio_data['settings']['llmApiKey'] = None
    return portfolio_data

@api_router.post("/portfolio")
async def save_portfolio(portfolio: Portfolio, _=Depends(verify_token)):
    save_json_file(PORTFOLIO_FILE, portfolio.model_dump())
    return {"message": "Portfolio saved successfully"}

@api_router.post("/upload/photo")
async def upload_photo(photo: UploadFile = File(...), _=Depends(verify_token)):
    # Validate file size
    contents = await photo.read()
    if len(contents) > MAX_PHOTO_SIZE:
        raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_PHOTO_SIZE / 1024 / 1024}MB limit")
    
    # Validate file extension
    if not validate_file_extension(photo.filename, ALLOWED_PHOTO_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPG, PNG, GIF, WEBP")
    
    # Generate unique filename
    filename = generate_unique_filename(photo.filename)
    file_path = PHOTOS_DIR / filename
    
    # Save the photo
    with open(file_path, 'wb') as buffer:
        buffer.write(contents)
    
    # Return the URL (relative path)
    photo_url = f"/uploads/photos/{filename}"
    return {"url": photo_url}

@api_router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...), _=Depends(verify_token)):
    # Validate file size
    contents = await file.read()
    if len(contents) > MAX_RESUME_SIZE:
        raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_RESUME_SIZE / 1024 / 1024}MB limit")
    
    # Validate file extension
    if not validate_file_extension(file.filename, ALLOWED_RESUME_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: PDF, DOC, DOCX")
    
    # Generate unique filename
    filename = generate_unique_filename(file.filename)
    file_path = RESUMES_DIR / filename
    
    # Save the resume
    with open(file_path, 'wb') as buffer:
        buffer.write(contents)
    
    # Get portfolio settings for LLM
    portfolio_data = load_json_file(PORTFOLIO_FILE, {})
    settings = portfolio_data.get('settings', {})
    llm_provider = settings.get('llmProvider', 'openai')
    llm_api_key = settings.get('llmApiKey')
    
    # Parse resume using AI
    try:
        extracted_data = await parse_resume_with_ai(file_path, llm_provider, llm_api_key)
        return {"message": "Resume uploaded and parsed", "extractedData": extracted_data}
    except NotImplementedError:
        return {
            "message": "Resume uploaded but AI parsing is not yet implemented",
            "filename": filename,
            "note": "Please fill in your information manually in the admin panel"
        }

async def parse_resume_with_ai(file_path: Path, llm_provider: str, api_key: Optional[str]):
    """
    Parse resume using AI. This is a placeholder - integrate with actual LLM APIs.
    
    To implement:
    1. Extract text from PDF/DOC using PyPDF2 or python-docx
    2. Send text to LLM with structured extraction prompt
    3. Parse LLM response into portfolio structure
    """
    # TODO: Implement actual AI parsing
    raise NotImplementedError("AI parsing not yet implemented. Please enter data manually.")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)