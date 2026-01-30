# 3D Portfolio Website - Deployment Guide

## Overview

This is a comprehensive 3D portfolio website with an admin panel for managing your professional information. The website features:

- **3D Interactive Experience**: A building/mansion with doors representing different sections (Skills, Experience, Projects, Education, Contact)
- **Admin Panel**: Upload resume for AI parsing or manually enter information
- **Configurable**: Multiple themes, photo positions, and LLM providers
- **File-Based Storage**: No database required - uses JSON files for simple deployment

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- GCP VM instance (for deployment)

## Local Development Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
Edit `backend/.env`:
```
SECRET_KEY="your-secret-key-here"
CORS_ORIGINS="http://localhost:3000"
```

5. Run the backend server:
```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
npm start
```

The website will open at `http://localhost:3000`

## Production Deployment on GCP VM

### Step 1: Create a GCP VM Instance

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to Compute Engine > VM Instances
3. Click "Create Instance"
4. Configure:
   - **Name**: portfolio-website
   - **Region**: Choose closest to your users
   - **Machine type**: e2-medium (2 vCPU, 4 GB memory) or higher
   - **Boot disk**: Ubuntu 22.04 LTS
   - **Firewall**: Allow HTTP and HTTPS traffic
5. Click "Create"

### Step 2: SSH into Your VM

```bash
gcloud compute ssh portfolio-website --zone=YOUR_ZONE
```

Or use the SSH button in the GCP Console.

### Step 3: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3 and pip
sudo apt install python3 python3-pip python3-venv -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

### Step 4: Clone Your Repository

```bash
cd /home/$USER
git clone https://github.com/Chetan55567/portfolio.git
cd portfolio
```

### Step 5: Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create production .env file
cat > .env << EOF
SECRET_KEY="$(openssl rand -hex 32)"
CORS_ORIGINS="http://YOUR_VM_IP,https://YOUR_DOMAIN"
EOF

# Create data directories
mkdir -p data uploads/photos uploads/resumes

# Test the backend
uvicorn server:app --host 0.0.0.0 --port 8000
```

Press Ctrl+C to stop after verifying it works.

### Step 6: Setup Backend as a System Service

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/portfolio-backend.service
```

Add the following content:

```ini
[Unit]
Description=Portfolio Backend API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/portfolio/backend
Environment="PATH=/home/$USER/portfolio/backend/venv/bin"
ExecStart=/home/$USER/portfolio/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable portfolio-backend
sudo systemctl start portfolio-backend
sudo systemctl status portfolio-backend
```

### Step 7: Build Frontend

```bash
cd /home/$USER/portfolio/frontend

# Install dependencies
npm install

# Create production .env file
cat > .env << EOF
REACT_APP_API_URL=http://YOUR_VM_IP:8000/api
EOF

# Build for production
npm run build
```

### Step 8: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Add the following content:

```nginx
server {
    listen 80;
    server_name YOUR_VM_IP YOUR_DOMAIN;

    # Frontend
    location / {
        root /home/$USER/portfolio/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Uploaded files
    location /uploads {
        alias /home/$USER/portfolio/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

In GCP Console, ensure firewall rules allow:
- TCP port 80 (HTTP)
- TCP port 443 (HTTPS)

### Step 10: (Optional) Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d YOUR_DOMAIN
```

Follow the prompts to configure SSL.

## Accessing the Website

### Public Website
Visit: `http://YOUR_VM_IP` or `https://YOUR_DOMAIN`

### Admin Panel

1. Navigate to: `http://YOUR_VM_IP/admin/login`

2. **Default Credentials**:
   - Username: `admin`
   - Password: `admin123`

3. **IMPORTANT**: Change the default password after first login!

## Admin Panel Usage Guide

### 1. Login
- Go to `/admin/login`
- Enter username and password
- Click "Login"

### 2. Upload Resume (AI-Powered)
- Go to "Resume Upload" tab
- Configure your LLM API key in "Settings" first
- Upload your resume (PDF, DOC, DOCX)
- Click "Upload and Parse Resume"
- AI will extract information automatically
- Review and edit extracted data in other tabs

### 3. Manual Entry
If AI parsing doesn't work or for manual updates:

#### Personal Info Tab
- Enter your name and title
- Upload professional photo
- Photo will appear on the homepage

#### Skills Tab
- Add skills with proficiency levels
- Click "+ Add Skill" to add more
- Remove skills with "Remove" button

#### Experience Tab
- Add work experience entries
- Include title, company, duration, description
- Click "+ Add Experience" for more entries

#### Projects Tab
- Add your projects
- Include name, description, technologies, and links
- Projects appear as interactive cards on the website

#### Education Tab
- Add educational qualifications
- Include degree, institution, and year

#### Contact Tab
- Add email, phone, LinkedIn, GitHub, website
- Empty fields won't show on the public website

#### Settings Tab
- **Theme**: Choose website theme
  - Modern Professional (default)
  - Dark Elegance
  - Minimal Clean
  - Vibrant Creative
- **Photo Position**: Where your photo appears
  - Top Right (default)
  - Top Left
  - Center
  - Bottom Center
- **LLM Provider**: For resume parsing
  - OpenAI (GPT)
  - Emergent LLM
  - Anthropic (Claude)
- **LLM API Key**: Your API key for AI parsing

### 4. Save Changes
- Click "Save Changes" button after editing
- Changes will appear on the website immediately

### 5. Preview
- Click "Preview" button to see live website
- Opens in a new tab

## Maintenance

### View Backend Logs
```bash
sudo journalctl -u portfolio-backend -f
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
sudo systemctl restart portfolio-backend
sudo systemctl restart nginx
```

### Update Application
```bash
cd /home/$USER/portfolio
git pull

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart portfolio-backend

# Update frontend
cd ../frontend
npm install
npm run build
sudo systemctl restart nginx
```

### Backup Data
```bash
# Backup portfolio data
cp -r /home/$USER/portfolio/backend/data /home/$USER/backup/
cp -r /home/$USER/portfolio/backend/uploads /home/$USER/backup/
```

## Security Best Practices

1. **Change Default Admin Password**:
   - The default credentials are `admin/admin123`
   - Change immediately after deployment!

2. **Setup SSL/HTTPS**:
   - Use Let's Encrypt (free)
   - Protects admin login and data

3. **Restrict Admin Access**:
   - Consider using a firewall to restrict admin panel to specific IPs

4. **Keep System Updated**:
```bash
sudo apt update && sudo apt upgrade -y
```

5. **Set Strong SECRET_KEY**:
   - Generated automatically during setup
   - Keep it secret!

## Troubleshooting

### Backend Not Starting
```bash
# Check service status
sudo systemctl status portfolio-backend

# Check logs
sudo journalctl -u portfolio-backend -n 50
```

### Frontend Not Loading
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx configuration
sudo nginx -t

# Check permissions
ls -la /home/$USER/portfolio/frontend/build
```

### API Connection Issues
- Verify `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in backend `.env`
- Ensure backend is running on port 8000

### File Upload Issues
```bash
# Check directory permissions
ls -la /home/$USER/portfolio/backend/uploads

# Fix permissions if needed
chmod -R 755 /home/$USER/portfolio/backend/uploads
```

## Architecture

```
┌─────────────────────────────────────────────┐
│                   Nginx                      │
│  (Reverse Proxy & Static File Server)       │
└─────────────┬───────────────────────────────┘
              │
      ┌───────┴───────┐
      │               │
      ▼               ▼
┌───────────┐   ┌──────────────┐
│  React    │   │   FastAPI    │
│  Frontend │   │   Backend    │
│  (Port    │   │   (Port      │
│   3000)   │   │    8000)     │
└───────────┘   └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │  File-Based  │
                │   Storage    │
                │  (JSON)      │
                └──────────────┘
```

## Support

For issues or questions:
- Check logs first
- Review this documentation
- Check GitHub repository issues
- Ensure all prerequisites are met

## License

This project is proprietary software for portfolio use.
