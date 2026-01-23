@echo off
echo ========================================
echo   INSTALACION COMPLETA FUNCIONARIOS PRM
echo   Gana tu Colegio 2028
echo ========================================
echo.

echo [1/6] Verificando estructura de directorios...
if not exist "Backend" (
    echo ERROR: Directorio Backend no encontrado
    pause
    exit /b 1
)
if not exist "frontend" (
    echo ERROR: Directorio frontend no encontrado
    pause
    exit /b 1
)
echo ✓ Estructura de directorios OK

echo.
echo [2/6] Instalando dependencias del Backend...
cd Backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo en instalacion de dependencias del backend
    pause
    exit /b 1
)
echo ✓ Dependencias del Backend instaladas

echo.
echo [3/6] Compilando Backend...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo en compilacion del backend
    pause
    exit /b 1
)
echo ✓ Backend compilado correctamente

echo.
echo [4/6] Ejecutando migracion de base de datos...
echo IMPORTANTE: Asegurate de que SQL Server este ejecutandose
echo y que la base de datos este configurada correctamente en .env
pause
echo.
echo Ejecutando migracion SQL...
sqlcmd -S localhost -d gana_tu_colegio_2028 -i "src\migrations\create-funcionarios-table.sql"
if %errorlevel% neq 0 (
    echo ADVERTENCIA: La migracion SQL podria haber fallado
    echo Ejecuta manualmente: src\migrations\create-funcionarios-table.sql
    echo.
)
echo ✓ Migracion de base de datos ejecutada

echo.
echo [5/6] Creando usuario administrador de funcionarios...
call npm run create-funcionarios-user
if %errorlevel% neq 0 (
    echo ADVERTENCIA: Fallo al crear usuario automaticamente
    echo Puedes crearlo manualmente ejecutando:
    echo npm run create-funcionarios-user
    echo.
)
echo ✓ Usuario funcionarios creado

echo.
echo [6/6] Instalando dependencias del Frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo en instalacion de dependencias del frontend
    pause
    exit /b 1
)
echo ✓ Dependencias del Frontend instaladas

cd ..
echo.
echo ========================================
echo   INSTALACION COMPLETADA
echo ========================================
echo.
echo 🎉 SISTEMA LISTO PARA USAR
echo.
echo 📋 CREDENCIALES DE ACCESO:
echo    Email: admin.funcionarios@prm.gov.do
echo    Password: funcionarios123
echo    Rol: funcionarios
echo.
echo 🚀 PARA INICIAR EL SISTEMA:
echo.
echo 1. Backend (Terminal 1):
echo    cd Backend
echo    npm run dev
echo.
echo 2. Frontend (Terminal 2):
echo    cd frontend
echo    npm start
echo.
echo 3. Acceder al sistema:
echo    - Abrir navegador en http://localhost:4200
echo    - Login con las credenciales de arriba
echo    - Hacer clic en "Funcionarios PRM" en el dashboard
echo.
echo ✨ ¡Disfruta del sistema integrado!
echo.
pause
