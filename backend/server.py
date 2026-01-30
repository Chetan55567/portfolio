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
import hashlib

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
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

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
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

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

# Initialize default admin user if not exists
def init_admin():
    admin_data = load_json_file(ADMIN_FILE)
    if not admin_data:
        default_admin = {
            "username": "admin",
            "password_hash": hash_password("admin123")
        }
        save_json_file(ADMIN_FILE, default_admin)

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
    return portfolio_data

@api_router.post("/portfolio")
async def save_portfolio(portfolio: Portfolio, _=Depends(verify_token)):
    save_json_file(PORTFOLIO_FILE, portfolio.dict())
    return {"message": "Portfolio saved successfully"}

@api_router.post("/upload/photo")
async def upload_photo(photo: UploadFile = File(...), _=Depends(verify_token)):
    # Save the photo
    file_extension = photo.filename.split('.')[-1]
    filename = f"profile_{datetime.now().timestamp()}.{file_extension}"
    file_path = PHOTOS_DIR / filename
    
    with open(file_path, 'wb') as buffer:
        shutil.copyfileobj(photo.file, buffer)
    
    # Return the URL (relative path)
    photo_url = f"/uploads/photos/{filename}"
    return {"url": photo_url}

@api_router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...), _=Depends(verify_token)):
    # Save the resume
    file_extension = file.filename.split('.')[-1]
    filename = f"resume_{datetime.now().timestamp()}.{file_extension}"
    file_path = RESUMES_DIR / filename
    
    with open(file_path, 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Get portfolio settings for LLM
    portfolio_data = load_json_file(PORTFOLIO_FILE, {})
    settings = portfolio_data.get('settings', {})
    llm_provider = settings.get('llmProvider', 'openai')
    llm_api_key = settings.get('llmApiKey')
    
    # Parse resume using AI
    extracted_data = await parse_resume_with_ai(file_path, llm_provider, llm_api_key)
    
    return {"message": "Resume uploaded", "extractedData": extracted_data}

async def parse_resume_with_ai(file_path: Path, llm_provider: str, api_key: Optional[str]):
    """
    Parse resume using AI. This is a placeholder - you would integrate with actual LLM APIs.
    For now, it returns a sample structure.
    """
    # TODO: Implement actual AI parsing with OpenAI, Emergent, or Anthropic
    # This would use libraries like PyPDF2 or python-docx to extract text,
    # then send to LLM for structured extraction
    
    # Placeholder return
    return {
        "personalInfo": {
            "name": "Extracted Name",
            "title": "Extracted Title",
            "photo": None
        },
        "skills": [
            {"name": "Extracted Skill 1", "level": "Advanced"},
            {"name": "Extracted Skill 2", "level": "Expert"}
        ],
        "experience": [
            {
                "title": "Extracted Position",
                "company": "Extracted Company",
                "duration": "2020 - Present",
                "description": "Extracted description"
            }
        ],
        "projects": [],
        "education": [],
        "contact": {},
        "settings": {
            "theme": "modern-professional",
            "photoPosition": "top-right",
            "llmProvider": llm_provider,
            "llmApiKey": api_key
        }
    }

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