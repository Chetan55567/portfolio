# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Public Endpoints

#### GET /
Get API information.

**Response:**
```json
{
  "message": "3D Portfolio API",
  "version": "1.0.0"
}
```

#### GET /portfolio
Get portfolio data (public access).

**Response:**
```json
{
  "personalInfo": {
    "name": "John Doe",
    "title": "DevOps Engineer",
    "photo": "/uploads/photos/profile.jpg"
  },
  "skills": [
    {
      "name": "Docker",
      "level": "Expert"
    }
  ],
  "experience": [...],
  "projects": [...],
  "education": [...],
  "contact": {
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "settings": {
    "theme": "modern-professional",
    "photoPosition": "top-right",
    "llmProvider": "openai"
  }
}
```

### Authentication Endpoints

#### POST /admin/login
Login to admin panel.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Protected Endpoints (Require Authentication)

#### POST /portfolio
Save portfolio data.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "personalInfo": {
    "name": "John Doe",
    "title": "DevOps Engineer",
    "photo": null
  },
  "skills": [
    {
      "name": "Docker",
      "level": "Expert"
    }
  ],
  "experience": [
    {
      "title": "Senior DevOps Engineer",
      "company": "Tech Corp",
      "duration": "2020 - Present",
      "description": "Leading DevOps initiatives"
    }
  ],
  "projects": [],
  "education": [],
  "contact": {
    "email": "john@example.com"
  },
  "settings": {
    "theme": "modern-professional",
    "photoPosition": "top-right",
    "llmProvider": "openai",
    "llmApiKey": "sk-..."
  }
}
```

**Response:**
```json
{
  "message": "Portfolio saved successfully"
}
```

#### POST /upload/photo
Upload profile photo.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `photo`: Image file (JPEG, PNG, etc.)

**Response:**
```json
{
  "url": "/uploads/photos/profile_1234567890.jpg"
}
```

#### POST /resume/upload
Upload and parse resume.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Resume file (PDF, DOC, DOCX)

**Response:**
```json
{
  "message": "Resume uploaded",
  "extractedData": {
    "personalInfo": {
      "name": "Extracted Name",
      "title": "Extracted Title"
    },
    "skills": [...],
    "experience": [...],
    "projects": [],
    "education": [],
    "contact": {},
    "settings": {...}
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Invalid credentials"
}
```

### 401 Token Expired
```json
{
  "detail": "Token has expired"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "username"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Example Usage

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Portfolio:**
```bash
curl http://localhost:8000/api/portfolio
```

**Save Portfolio (with auth):**
```bash
TOKEN="your-token-here"

curl -X POST http://localhost:8000/api/portfolio \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "personalInfo": {
      "name": "John Doe",
      "title": "DevOps Engineer",
      "photo": null
    },
    "skills": [],
    "experience": [],
    "projects": [],
    "education": [],
    "contact": {},
    "settings": {
      "theme": "modern-professional",
      "photoPosition": "top-right",
      "llmProvider": "openai",
      "llmApiKey": null
    }
  }'
```

**Upload Photo:**
```bash
TOKEN="your-token-here"

curl -X POST http://localhost:8000/api/upload/photo \
  -H "Authorization: Bearer $TOKEN" \
  -F "photo=@/path/to/photo.jpg"
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// Login
const login = async (username, password) => {
  const response = await axios.post(`${API_BASE}/admin/login`, {
    username,
    password
  });
  return response.data.token;
};

// Get Portfolio
const getPortfolio = async () => {
  const response = await axios.get(`${API_BASE}/portfolio`);
  return response.data;
};

// Save Portfolio
const savePortfolio = async (token, portfolioData) => {
  const response = await axios.post(
    `${API_BASE}/portfolio`,
    portfolioData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// Upload Photo
const uploadPhoto = async (token, photoFile) => {
  const formData = new FormData();
  formData.append('photo', photoFile);

  const response = await axios.post(
    `${API_BASE}/upload/photo`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data.url;
};
```

## Data Models

### PersonalInfo
```typescript
{
  name: string,
  title: string,
  photo: string | null
}
```

### Skill
```typescript
{
  name: string,
  level?: string
}
```

### Experience
```typescript
{
  title: string,
  company: string,
  duration: string,
  description?: string,
  responsibilities?: string[]
}
```

### Project
```typescript
{
  name: string,
  description: string,
  technologies?: string[],
  link?: string
}
```

### Education
```typescript
{
  degree: string,
  institution: string,
  year: string,
  gpa?: string
}
```

### Contact
```typescript
{
  email?: string,
  phone?: string,
  linkedin?: string,
  github?: string,
  website?: string
}
```

### Settings
```typescript
{
  theme: "modern-professional" | "dark-elegance" | "minimal-clean" | "vibrant-creative",
  photoPosition: "top-left" | "top-right" | "center" | "bottom-center",
  llmProvider: "openai" | "emergent" | "anthropic",
  llmApiKey?: string
}
```

## Rate Limiting

Currently, there are no rate limits. Consider implementing rate limiting in production.

## CORS

CORS is configured via the `CORS_ORIGINS` environment variable in `.env`.

Default: `*` (all origins allowed)

For production, set specific origins:
```
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Security Notes

1. Always use HTTPS in production
2. Change default admin credentials immediately
3. Keep your SECRET_KEY secure
4. Don't commit API keys to version control
5. Implement rate limiting for production
6. Regularly update dependencies
