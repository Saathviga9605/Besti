#!/bin/bash

echo "============================================"
echo "Besti Frontend Setup"
echo "============================================"

cd frontend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env.local file
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
fi

echo ""
echo "Frontend setup complete!"
echo ""
echo "To start the frontend, run:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
