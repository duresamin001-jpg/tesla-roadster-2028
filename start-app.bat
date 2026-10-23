@echo off
title Tesla Roadster 2028 App Launcher
echo ========================================================
echo   Launching Tesla Roadster 2028 Interactive Automotive App
echo ========================================================
set PATH=C:\Users\durek\nodejs;%PATH%
cd /d "C:\Users\durek\.gemini\antigravity\scratch\tesla-roadster-2028"
start http://localhost:3000/
npx vite --port 3000 --host
pause
