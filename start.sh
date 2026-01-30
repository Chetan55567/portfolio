#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Starting 3D Portfolio Application ===${NC}"
echo ""

# Start backend in background
echo -e "${YELLOW}Starting Backend Server...${NC}"
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}"
echo "Backend logs: /tmp/backend.log"

cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo ""
echo -e "${YELLOW}Starting Frontend Server...${NC}"
cd frontend
npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started (PID: $FRONTEND_PID)${NC}"
echo "Frontend logs: /tmp/frontend.log"

cd ..

echo ""
echo -e "${GREEN}=== Application Started! ===${NC}"
echo ""
echo "Access the application:"
echo "  Website: http://localhost:3000"
echo "  Admin Panel: http://localhost:3000/admin/login"
echo "  API: http://localhost:8000/api/"
echo ""
echo "Default admin credentials: admin / admin123"
echo ""
echo "To stop the application:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or create a stop.sh script with these PIDs"
echo $BACKEND_PID > /tmp/portfolio_backend.pid
echo $FRONTEND_PID > /tmp/portfolio_frontend.pid
