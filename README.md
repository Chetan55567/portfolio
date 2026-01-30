# 3D Portfolio Website

A stunning, interactive 3D portfolio website with an admin panel for easy content management. Perfect for DevOps engineers, developers, and professionals who want to showcase their work in an eye-catching way.

## ✨ Features

### 🏗️ 3D Interactive Experience
- **Immersive 3D Building**: Navigate through a virtual mansion/building where each door represents a section of your portfolio
- **Smooth Animations**: Entrance animations, zooming effects, and interactive door hover effects
- **Modern Graphics**: Built with Three.js and React Three Fiber for stunning 3D visuals
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🎨 Visual Highlights
- **Hero Introduction**: Eye-catching homepage with your photo and name
- **Animated Sections**: Each portfolio section (Skills, Experience, Projects, Education, Contact) is a clickable 3D door
- **Customizable Themes**: Multiple professional themes to choose from
- **Photo Positioning**: Configure where your professional photo appears

### 🔧 Admin Panel
- **Easy Login**: Secure admin authentication
- **Resume Upload**: AI-powered resume parsing (supports PDF, DOC, DOCX)
- **Manual Entry**: Full control to add/edit all information manually
- **Photo Management**: Upload and manage your professional photo
- **Theme Configuration**: Change themes and visual settings
- **Contact Management**: Add social links, email, phone, etc.
- **Visibility Control**: Sections without data are automatically hidden

### 🤖 AI-Powered
- **Resume Parsing**: Automatic extraction of skills, experience, education from uploaded resumes
- **Multiple LLM Support**: 
  - OpenAI (GPT)
  - Emergent LLM
  - Anthropic (Claude)
- **Fallback to Manual**: If AI doesn't work perfectly, manually edit everything

### 💾 Simple Deployment
- **File-Based Storage**: No database required - uses JSON files
- **Easy Backup**: Just copy the data directory
- **Portable**: Deploy anywhere Python and Node.js run
- **GCP Ready**: Includes complete deployment guide for Google Cloud Platform

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/Chetan55567/portfolio.git
cd portfolio
```

2. **Setup Backend**:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

3. **Setup Frontend** (in a new terminal):
```bash
cd frontend
npm install
npm start
```

4. **Access the application**:
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin/login
   - Default credentials: `admin` / `admin123`

## 📖 Documentation

- **[Deployment Guide](DEPLOYMENT.md)**: Complete guide for deploying to GCP VM
- **Admin Panel Guide**: See DEPLOYMENT.md for detailed admin usage
- **API Documentation**: Available at http://localhost:8000/docs when running

## 🎯 Use Cases

Perfect for:
- **DevOps Engineers**: Showcase your infrastructure and automation skills
- **Software Developers**: Display your projects and technical expertise
- **IT Professionals**: Present your career journey in an engaging way
- **Job Seekers**: Stand out to recruiters with an interactive resume
- **Freelancers**: Impress potential clients with a modern portfolio

## 🏛️ Architecture

```
Frontend (React + Three.js)
    ↕️
Backend (FastAPI)
    ↕️
File Storage (JSON)
```

- **Frontend**: React with Three.js for 3D rendering
- **Backend**: FastAPI with file-based storage
- **Storage**: JSON files (no database needed)
- **Upload Storage**: Local file system for photos and resumes

## 🎨 Sections

The 3D building contains doors for:
1. **Skills**: Your technical skills with proficiency levels
2. **Experience**: Work history and responsibilities
3. **Projects**: Portfolio projects with links and technologies
4. **Education**: Academic qualifications
5. **Contact**: Email, phone, LinkedIn, GitHub, personal website

Sections without data are automatically hidden!

## 🔐 Security

- JWT-based authentication for admin panel
- Secure password hashing
- CORS protection
- Token expiration
- File upload validation

**Important**: Change default admin credentials after first deployment!

## 🛠️ Tech Stack

### Frontend
- React 18
- Three.js & React Three Fiber
- Framer Motion (animations)
- Tailwind CSS
- React Router
- Axios

### Backend
- FastAPI
- Python 3.8+
- PyJWT (authentication)
- File-based storage (JSON)
- OpenAI SDK (for AI parsing)

## 📸 Screenshots

> Add screenshots of your deployed portfolio here!

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and customize for your own use.

## 📝 License

Proprietary - For personal portfolio use.

## 🆘 Support

Having issues? Check:
1. [Deployment Guide](DEPLOYMENT.md) for detailed instructions
2. Logs: `sudo journalctl -u portfolio-backend -f`
3. Backend running: `http://localhost:8000/api/`
4. Frontend .env file has correct API URL

## 🎉 Getting Started with Admin Panel

1. **Login**: Navigate to `/admin/login` with default credentials
2. **Upload Resume**: Go to "Resume Upload" tab and upload your resume
3. **Review Data**: Check all tabs and edit as needed
4. **Configure Settings**: Set theme, photo position, and LLM provider
5. **Save**: Click "Save Changes"
6. **Preview**: Click "Preview" to see your live portfolio!

## 🌟 Features in Detail

### Theme Options
- **Modern Professional** (default): Clean, business-ready design
- **Dark Elegance**: Sophisticated dark theme
- **Minimal Clean**: Simplicity at its best
- **Vibrant Creative**: Bold and colorful

### Photo Positions
- Top Right (default)
- Top Left
- Center
- Bottom Center

### LLM Providers for Resume Parsing
- OpenAI (GPT-4, GPT-3.5)
- Emergent LLM
- Anthropic (Claude)

Configure your preferred provider and API key in Settings.

## 📋 Checklist for Deployment

- [ ] Clone repository
- [ ] Install Python and Node.js
- [ ] Setup backend with virtual environment
- [ ] Setup frontend and build for production
- [ ] Configure Nginx
- [ ] Setup systemd service
- [ ] Configure firewall
- [ ] Setup SSL (optional but recommended)
- [ ] Change default admin password
- [ ] Upload your resume or enter data manually
- [ ] Test all features
- [ ] Share your portfolio URL!

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions for GCP and other platforms.

---

Made with ❤️ for professionals who want to stand out
