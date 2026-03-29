@echo off
echo ============================================
echo Besti Frontend Setup
echo ============================================

cd frontend

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
call npm install

REM Create .env.local file
if not exist .env.local (
    echo Creating .env.local file...
    copy .env.example .env.local
)

echo.
echo Frontend setup complete!
echo.
echo To start the frontend, run:
echo   cd frontend
echo   npm run dev
echo.
pause
