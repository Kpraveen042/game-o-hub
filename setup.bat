@echo off
:: ─────────────────────────────────────────────────────────────────
::  GAME-O-HUB — One-command setup script (Windows)
::  Usage: Double-click setup.bat  OR  run in Command Prompt
:: ─────────────────────────────────────────────────────────────────

echo.
echo ╔══════════════════════════════════════╗
echo ║        GAME-O-HUB  SETUP             ║
echo ╚══════════════════════════════════════╝
echo.

:: ── Frontend ──────────────────────────────────────────────────────
echo [1/3] Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed. Make sure Node.js is installed from https://nodejs.org
    pause
    exit /b 1
)
cd ..
echo ✔  Frontend ready
echo.

:: ── Python check ──────────────────────────────────────────────────
echo [2/3] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ⚠  Python not found.
    echo    Install from https://python.org and check "Add Python to PATH"
    echo    Then run:  pip install -r ai-games\requirements.txt
    goto SKIP_PY
)
echo ✔  Python found
echo.

:: ── AI Games deps ─────────────────────────────────────────────────
echo [3/3] Installing AI game dependencies...
echo    This may take a few minutes on first run...
pip install -r ai-games\requirements.txt
if errorlevel 1 (
    echo WARNING: Some packages failed to install. Check the error above.
) else (
    echo ✔  AI games base packages ready
)

echo.
echo Note: pyaudio (for Voice Command mic) needs:
echo    pip install pipwin
echo    pipwin install pyaudio

:SKIP_PY

echo.
echo ╔══════════════════════════════════════╗
echo ║         SETUP COMPLETE!              ║
echo ╚══════════════════════════════════════╝
echo.
echo   Start the website:
echo     cd frontend
echo     npm run dev
echo.
echo   Emotion game:
echo     cd ai-games
echo     python emotion/emotion_game.py
echo.
echo   Voice game:
echo     cd ai-games
echo     python voice/voice_game.py
echo.
pause
