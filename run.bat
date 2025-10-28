@echo off
REM Friendly Finance Frontend - Quick Start Script

echo.
echo ========================================
echo   Friendly Finance Frontend
echo   Starting Development Server
echo ========================================
echo.

REM Navigate to the correct directory
cd FE-FriendlyFinance

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Start the development server
echo Starting development server...
echo.
call npm run dev

pause

