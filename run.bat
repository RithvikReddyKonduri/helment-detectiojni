@echo off
setlocal enabledelayedexpansion
title Indian Traffic AI Helmet Detection System
cls

echo ======================================================================
echo          INDIAN TRAFFIC AI HELMET DETECTION - BOOTSTRAP
echo ======================================================================
echo.

:: 1. Locate Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python was not detected in system PATH.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('where python') do (
    set "PYTHON_EXE=%%i"
    goto :python_found
)
:python_found
echo [SYSTEM] Python runtime: "%PYTHON_EXE%"

:: 2. Start Python FastAPI Backend (Port 8000)
echo [SYSTEM] Starting FastAPI Inference Backend on port 8000...
start "AI Helmet Backend API (Port 8000)" cmd /k ""%PYTHON_EXE%" -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"

:: 3. Start Next.js Frontend (Port 3000)
echo [SYSTEM] Starting Next.js Dashboard on port 3000...
cd frontend
start "AI Helmet Dashboard (Port 3000)" cmd /k "npm run dev"
cd ..

:: 4. Launch Browser
echo.
echo ======================================================================
echo  Backend:  http://localhost:8000
echo  Frontend: http://localhost:3000
echo ======================================================================
echo.
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

pause
