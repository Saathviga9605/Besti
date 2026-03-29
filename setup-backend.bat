@echo off
echo ============================================
echo Besti Backend Setup
echo ============================================

cd backend

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create .env file
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit backend\.env and add your OpenAI API key!
    echo.
)

echo.
echo Backend setup complete!
echo.
echo To start the backend, run:
echo   cd backend
echo   venv\Scripts\activate
echo   python main.py
echo.
pause
