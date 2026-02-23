@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Always run from this script's directory
cd /d "%~dp0"
set "ROOT=%CD%"

if not exist "%ROOT%\logs" mkdir "%ROOT%\logs" >nul 2>nul

echo ============================================
echo      Tripology - AI Travel Marketplace
echo      Development Environment Runner
echo ============================================
echo Root: %ROOT%
echo.

REM =============================================
REM  PORT CONFIGURATION (different from MCI)
REM  MCI uses: 5432, 5000, 5173
REM  Tripology uses: 5433, 8001, 3001
REM =============================================
set "DB_PORT=5433"
set "REDIS_PORT=6380"
set "OLLAMA_PORT=11435"
set "API_PORT=8001"
set "FRONTEND_PORT=3001"
set "PYTHON_EXE=C:/Users/HAMED/AppData/Local/Python/pythoncore-3.14-64/python.exe"

REM --- Detect LAN IP for mobile access ---
set "LAN_IP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
  for /f "tokens=*" %%b in ("%%a") do (
    set "_IP=%%b"
    set "_IP=!_IP: =!"
    if not defined LAN_IP (
      echo !_IP! | findstr /B "192.168." >nul && set "LAN_IP=!_IP!"
      echo !_IP! | findstr /B "10." >nul && set "LAN_IP=!_IP!"
    )
  )
)
if not defined LAN_IP set "LAN_IP=localhost"
echo [NET]    LAN IP detected: %LAN_IP%

REM =========================================
REM  Step 1: Docker Services (DB, Redis, Ollama)
REM =========================================
echo [1/5] Checking Docker Services...
where docker >nul 2>nul
if errorlevel 1 (
  echo [DOCKER] ERROR: Docker not found in PATH.
  echo          Install Docker Desktop from https://docker.com
  pause
  exit /b 1
)

REM Check if containers already exist and are running
docker ps --format "{{.Names}}" 2>nul | findstr "tripology-db" >nul
if not errorlevel 1 (
  echo [DB]     Tripology PostgreSQL already running on port %DB_PORT%.
  goto :check_redis
)

REM Start PostgreSQL with pgvector on custom port
echo [DB]     Starting PostgreSQL (pgvector) on port %DB_PORT%...
docker run -d --name tripology-db ^
  -e POSTGRES_DB=tripology_db ^
  -e POSTGRES_USER=tripology ^
  -e POSTGRES_PASSWORD=tripology_pass ^
  -p %DB_PORT%:5432 ^
  -v tripology_pgdata:/var/lib/postgresql/data ^
  --health-cmd="pg_isready -U tripology -d tripology_db" ^
  --health-interval=10s --health-timeout=5s --health-retries=5 ^
  pgvector/pgvector:pg16 >nul 2>nul

if errorlevel 1 (
  echo [DB]     WARNING: Could not start PostgreSQL. It may already exist stopped.
  echo [DB]     Trying to restart...
  docker start tripology-db >nul 2>nul
)

echo [DB]     Waiting for PostgreSQL to accept connections...
set "DB_READY=0"
for /L %%i in (1,1,20) do (
  if !DB_READY! EQU 0 (
    docker exec tripology-db pg_isready -U tripology -d tripology_db >nul 2>nul
    if not errorlevel 1 (
      set "DB_READY=1"
      echo [DB]     PostgreSQL is ready on port %DB_PORT%.
    ) else (
      timeout /t 1 /nobreak >nul
    )
  )
)
if !DB_READY! EQU 0 (
  echo [DB]     WARNING: PostgreSQL not ready after 20s. Continuing anyway...
)

:check_redis
REM --- Redis ---
docker ps --format "{{.Names}}" 2>nul | findstr "tripology-redis" >nul
if not errorlevel 1 (
  echo [REDIS]  Tripology Redis already running on port %REDIS_PORT%.
  goto :check_ollama
)

echo [REDIS]  Starting Redis on port %REDIS_PORT%...
docker run -d --name tripology-redis ^
  -p %REDIS_PORT%:6379 ^
  -v tripology_redisdata:/data ^
  redis:7-alpine >nul 2>nul

if errorlevel 1 (
  echo [REDIS]  WARNING: Could not start Redis. Trying to restart...
  docker start tripology-redis >nul 2>nul
)
echo [REDIS]  Redis running on port %REDIS_PORT%.

:check_ollama
REM --- Ollama ---
docker ps --format "{{.Names}}" 2>nul | findstr "tripology-ollama" >nul
if not errorlevel 1 (
  echo [AI]     Tripology Ollama already running on port %OLLAMA_PORT%.
  goto :check_python
)

REM Check if Ollama image exists locally before trying to run
docker image inspect ollama/ollama:latest >nul 2>nul
if errorlevel 1 (
  echo [AI]     WARNING: Ollama image not found locally. Skipping Ollama.
  echo [AI]     To install later, run: docker pull ollama/ollama:latest
  echo [AI]     Backend will start without AI features.
  goto :check_python
)

echo [AI]     Starting Ollama on port %OLLAMA_PORT%...
docker run -d --name tripology-ollama ^
  -p %OLLAMA_PORT%:11434 ^
  -v tripology_ollama_models:/root/.ollama ^
  --memory=8g ^
  ollama/ollama:latest >nul 2>nul

if errorlevel 1 (
  echo [AI]     WARNING: Could not start Ollama. Trying to restart...
  docker start tripology-ollama >nul 2>nul
)
echo [AI]     Ollama running on port %OLLAMA_PORT%.

REM =========================================
REM  Step 2: Python Environment
REM =========================================
:check_python
echo.
echo [2/5] Checking Python...
"%PYTHON_EXE%" --version >nul 2>nul
if errorlevel 1 (
  REM Fallback to system python
  where python >nul 2>nul
  if errorlevel 1 (
    echo [PY]  ERROR: Python not found!
    echo        Install Python from https://python.org
    pause
    exit /b 1
  )
  set "PYTHON_EXE=python"
)
for /f "tokens=*" %%v in ('"%PYTHON_EXE%" --version 2^>nul') do echo [PY]     %%v found.

REM =========================================
REM  Step 3: Node.js / pnpm
REM =========================================
echo.
echo [3/5] Checking Node.js...
where pnpm >nul 2>nul
if errorlevel 1 (
  where npm >nul 2>nul
  if errorlevel 1 (
    echo [WEB] ERROR: pnpm/npm not found in PATH.
    echo        Install Node.js from https://nodejs.org
    echo        Then: npm install -g pnpm
    pause
    exit /b 1
  )
  set "PKG_MGR=npm"
  echo [WEB]    npm found (pnpm recommended: npm install -g pnpm^)
) else (
  set "PKG_MGR=pnpm"
  for /f "tokens=*" %%v in ('pnpm --version 2^>nul') do echo [WEB]    pnpm %%v found.
)
for /f "tokens=*" %%v in ('node --version 2^>nul') do echo [WEB]    Node.js %%v found.

REM =========================================
REM  Step 4: Firewall Rules
REM =========================================
echo.
echo [4/5] Configuring Firewall for mobile access...

REM API port
netsh advfirewall firewall show rule name="Tripology API Dev (%API_PORT%)" >nul 2>nul
if errorlevel 1 (
  netsh advfirewall firewall add rule name="Tripology API Dev (%API_PORT%)" dir=in action=allow protocol=TCP localport=%API_PORT% >nul 2>nul
  if errorlevel 1 (
    echo [FW]     WARNING: Cannot add rule for port %API_PORT%. Run as Administrator for mobile access.
  ) else (
    echo [FW]     Added rule for port %API_PORT%.
  )
) else (
  echo [FW]     Rule for port %API_PORT% already exists.
)

REM Frontend port
netsh advfirewall firewall show rule name="Tripology Frontend Dev (%FRONTEND_PORT%)" >nul 2>nul
if errorlevel 1 (
  netsh advfirewall firewall add rule name="Tripology Frontend Dev (%FRONTEND_PORT%)" dir=in action=allow protocol=TCP localport=%FRONTEND_PORT% >nul 2>nul
  if errorlevel 1 (
    echo [FW]     WARNING: Cannot add rule for port %FRONTEND_PORT%. Run as Administrator for mobile access.
  ) else (
    echo [FW]     Added rule for port %FRONTEND_PORT%.
  )
) else (
  echo [FW]     Rule for port %FRONTEND_PORT% already exists.
)

REM =========================================
REM  Step 5: Start Services
REM =========================================
echo.
echo [5/5] Starting Services...

REM --- Install Frontend Dependencies ---
set "NEED_INSTALL=0"
if not exist "%ROOT%\node_modules" set "NEED_INSTALL=1"
if not exist "%ROOT%\node_modules\.pnpm" if "!PKG_MGR!"=="pnpm" set "NEED_INSTALL=1"

if !NEED_INSTALL! EQU 1 (
  echo [WEB]    Installing frontend dependencies...
  call %PKG_MGR% install
  if errorlevel 1 (
    echo [WEB]    ERROR: %PKG_MGR% install failed!
    pause
    exit /b 1
  )
  echo [WEB]    Dependencies installed.
) else (
  echo [WEB]    Dependencies up to date.
)

REM --- Start Frontend (Next.js on custom port, bound to 0.0.0.0 for LAN access) ---
echo [WEB]    Starting Next.js dev server on port %FRONTEND_PORT% (LAN enabled)...
start "Tripology Frontend" cmd /k "cd /d "%ROOT%" && set NEXT_PUBLIC_API_URL=http://%LAN_IP%:%API_PORT%/api/v1 && %PKG_MGR% run dev -- -p %FRONTEND_PORT% -H 0.0.0.0"
timeout /t 5 /nobreak >nul

REM --- Install Backend Dependencies ---
echo [API]    Checking backend dependencies...
"%PYTHON_EXE%" -c "import fastapi, uvicorn, sqlalchemy, asyncpg" >nul 2>nul
if errorlevel 1 (
  echo [API]    Installing backend dependencies...
  "%PYTHON_EXE%" -m pip install -r "%ROOT%\backend\requirements.txt" >nul 2>nul
  "%PYTHON_EXE%" -m pip install socksio email-validator >nul 2>nul
)
echo [API]    Backend dependencies OK.

echo.
echo ============================================
echo      All Services Starting
echo ============================================
echo.
echo   Desktop:
echo     API:       http://localhost:%API_PORT%
echo     Swagger:   http://localhost:%API_PORT%/docs
echo     Frontend:  http://localhost:%FRONTEND_PORT%
echo.
echo   ============================================
echo   =  MOBILE ACCESS (same WiFi network)      =
echo   ============================================
echo   =                                          =
echo   =  Open this URL on your phone:            =
echo   =                                          =
echo   =  http://%LAN_IP%:%FRONTEND_PORT%       =
echo   =                                          =
echo   =  API: http://%LAN_IP%:%API_PORT%       =
echo   =                                          =
echo   ============================================
echo.
echo   Docker Services:
echo     PostgreSQL: localhost:%DB_PORT%
echo     Redis:      localhost:%REDIS_PORT%
echo     Ollama:     localhost:%OLLAMA_PORT%
echo.
echo ============================================
echo   Press Ctrl+C to stop the backend
echo   Close the "Tripology Frontend" window to stop Next.js
echo ============================================
echo.

REM --- Start Backend (FastAPI/Uvicorn) ---
set DATABASE_URL=postgresql+asyncpg://tripology:tripology_pass@localhost:%DB_PORT%/tripology_db
set REDIS_URL=redis://localhost:%REDIS_PORT%/0
set OLLAMA_BASE_URL=http://localhost:%OLLAMA_PORT%
set ALLOWED_ORIGINS=http://localhost:%FRONTEND_PORT%,http://%LAN_IP%:%FRONTEND_PORT%,http://0.0.0.0:%FRONTEND_PORT%
set NEXT_PUBLIC_API_URL=http://%LAN_IP%:%API_PORT%/api/v1
set DEBUG=true

cd /d "%ROOT%\backend"
"%PYTHON_EXE%" -m uvicorn app.main:app --host 0.0.0.0 --port %API_PORT% --reload

echo.
echo Backend stopped.
pause
