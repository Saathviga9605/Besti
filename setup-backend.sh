#!/bin/bash

echo "============================================"
echo "Besti Backend Setup"
echo "============================================"

cd backend

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Edit backend/.env and add your OpenAI API key!"
    echo ""
fi

echo ""
echo "Backend setup complete!"
echo ""
echo "To start the backend, run:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
