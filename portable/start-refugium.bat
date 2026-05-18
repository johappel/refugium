@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "APP_DIR=%SCRIPT_DIR%app"
set "SERVER_SCRIPT=%SCRIPT_DIR%serve-refugium.ps1"
set "MINISERVE_EXE=%SCRIPT_DIR%server\miniserve.exe"
set "CADDY_EXE=%SCRIPT_DIR%server\caddy.exe"

if not exist "%APP_DIR%\index.html" (
  echo Portable App nicht gefunden: "%APP_DIR%\index.html"
  echo Fuehre zuerst scripts\package-portable.ps1 aus oder kopiere dist nach portable\app.
  pause
  exit /b 1
)

if exist "%MINISERVE_EXE%" (
  start "Refugium Server" /D "%APP_DIR%" "%MINISERVE_EXE%" --index index.html --port 4173 .
  timeout /t 1 /nobreak >nul
  start "" http://127.0.0.1:4173/
  exit /b 0
)

if exist "%CADDY_EXE%" (
  start "Refugium Server" /D "%APP_DIR%" "%CADDY_EXE%" file-server --listen 127.0.0.1:4173 --root "%APP_DIR%"
  timeout /t 1 /nobreak >nul
  start "" http://127.0.0.1:4173/
  exit /b 0
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SERVER_SCRIPT%" -AppDir "%APP_DIR%"
exit /b %errorlevel%