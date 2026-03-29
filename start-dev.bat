@echo off
echo ============================================
echo Besti - Start Development Servers
echo ============================================
echo.
echo Make sure you have completed the setup:
echo   - Run setup-backend.bat
echo   - Run setup-frontend.bat
echo   - Update backend\.env with your OpenAI API key
echo.
echo Starting servers in 5 seconds...
timeout /t 5

REM Start backend in a new window
cd backend
start "Besti Backend" cmd /k "venv\Scripts\activate && python main.py"

timeout /t 2

REM Start frontend in a new window
cd ..\frontend
start "Besti Frontend" cmd /k "npm run dev"

echo.
echo Servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
pause
