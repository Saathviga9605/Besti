#!/bin/bash

echo "============================================"
echo "Besti - Start Development Servers"
echo "============================================"
echo ""
echo "Make sure you have completed the setup:"
echo "  - Run ./setup-backend.sh"
echo "  - Run ./setup-frontend.sh"
echo "  - Update backend/.env with your OpenAI API key"
echo ""
echo "Starting servers..."
echo ""

# Start backend in the background
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
cd ../frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
