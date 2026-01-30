#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== 3D Portfolio Setup Script ===${NC}"
echo ""

# Check Python
echo -e "${YELLOW}Checking Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi
echo -e "${GREEN}Python found: $(python3 --version)${NC}"

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi
echo -e "${GREEN}Node.js found: $(node --version)${NC}"

# Setup Backend
echo ""
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install Python dependencies!${NC}"
    exit 1
fi

echo -e "${GREEN}Backend setup complete!${NC}"

cd ..

# Setup Frontend
echo ""
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies (this may take a few minutes)..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Node.js dependencies!${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}Frontend setup complete!${NC}"

cd ..

# Create data directories
echo ""
echo -e "${YELLOW}Creating data directories...${NC}"
mkdir -p backend/data backend/uploads/photos backend/uploads/resumes
echo -e "${GREEN}Data directories created!${NC}"

echo ""
echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo ""
echo "To start the application:"
echo ""
echo -e "${YELLOW}1. Start Backend:${NC}"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn server:app --host 0.0.0.0 --port 8000 --reload"
echo ""
echo -e "${YELLOW}2. Start Frontend (in a new terminal):${NC}"
echo "   cd frontend"
echo "   npm start"
echo ""
echo -e "${YELLOW}3. Access the application:${NC}"
echo "   Website: http://localhost:3000"
echo "   Admin Panel: http://localhost:3000/admin/login"
echo "   Default credentials: admin / admin123"
echo ""
