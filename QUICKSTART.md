# Quick Start Guide

Get your 3D portfolio website running in 5 minutes!

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher  
- Git

## Installation

### Option 1: Automated Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Chetan55567/portfolio.git
cd portfolio

# 2. Run setup script
chmod +x setup.sh
./setup.sh

# 3. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your settings
```

### Option 2: Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/Chetan55567/portfolio.git
cd portfolio

# 2. Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
cd ..

# 3. Setup Frontend
cd frontend
npm install
cp .env.example .env
cd ..
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Using Start Script

```bash
chmod +x start.sh
./start.sh
```

## Access the Application

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **API**: http://localhost:8000/api/

## Default Login

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

## First Steps

1. **Login to Admin Panel**
   - Navigate to http://localhost:3000/admin/login
   - Use default credentials

2. **Upload Your Resume**
   - Click "Resume Upload" tab
   - Upload your PDF, DOC, or DOCX resume
   - (AI parsing is not yet implemented - data will need manual entry)

3. **Fill in Your Information**
   - **Personal Info**: Add your name, title, and photo
   - **Skills**: Add your technical skills
   - **Experience**: Add work history
   - **Projects**: Add portfolio projects
   - **Education**: Add qualifications
   - **Contact**: Add contact information

4. **Configure Settings**
   - Choose your theme
   - Set photo position
   - Configure LLM provider (if using AI parsing)

5. **Save and Preview**
   - Click "Save Changes"
   - Click "Preview" to see your portfolio

## Stopping the Application

**If using start.sh:**
```bash
# Find the PIDs
cat /tmp/portfolio_backend.pid
cat /tmp/portfolio_frontend.pid

# Kill the processes
kill $(cat /tmp/portfolio_backend.pid) $(cat /tmp/portfolio_frontend.pid)
```

**Manual:**
- Press `Ctrl+C` in both terminal windows

## Common Issues

### Backend won't start
```bash
# Check Python version
python3 --version  # Should be 3.8+

# Activate virtual environment
cd backend
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start
```bash
# Check Node version
node --version  # Should be 16+

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Find and kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Find and kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### 3D scene not loading
- Check browser console for errors
- Ensure browser supports WebGL
- Try a different browser (Chrome recommended)

## Next Steps

1. Read [README.md](README.md) for complete features
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. Check [SECURITY.md](SECURITY.md) for security best practices
4. See [API.md](API.md) for API documentation

## Sample Data

Want to see the website with example data?

```bash
# Copy sample data to backend
cp sample-data.json backend/data/portfolio.json

# Restart backend
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

Now visit http://localhost:3000 to see the portfolio with sample DevOps engineer data.

## Customization

### Change Themes
1. Login to admin panel
2. Go to Settings tab
3. Select from 4 available themes:
   - Modern Professional
   - Dark Elegance
   - Minimal Clean
   - Vibrant Creative

### Change Photo Position
1. Login to admin panel
2. Go to Settings tab
3. Select photo position:
   - Top Right (default)
   - Top Left
   - Center
   - Bottom Center

### Hide Sections
Simply leave sections empty in the admin panel. Empty sections are automatically hidden from visitors.

## Need Help?

- **Documentation**: See all markdown files in repository
- **Issues**: Open an issue on GitHub
- **Security**: Review SECURITY.md

## Production Deployment

Ready to deploy? See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions on deploying to:
- Google Cloud Platform (GCP)
- Any Linux VM
- With Nginx and SSL

---

**You're all set!** 🎉

Visit http://localhost:3000 to see your 3D portfolio website.
