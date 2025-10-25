@echo off
echo 🏛️ Instalando Gana tu Colegio 2028
echo ==================================

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js v18 o superior.
    pause
    exit /b 1
)

REM Verificar si npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado. Por favor instala npm.
    pause
    exit /b 1
)

echo ✅ Node.js y npm están instalados

REM Instalar dependencias del backend
echo 📦 Instalando dependencias del backend...
cd Backend
call npm install

REM Crear archivo .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env...
    copy env.example .env
    echo ⚠️  Por favor edita el archivo Backend\.env con tus credenciales de MySQL
)

cd ..

REM Instalar dependencias del frontend
echo 📦 Instalando dependencias del frontend...
cd frontend
call npm install

cd ..

echo.
echo 🎉 Instalación completada!
echo.
echo 📋 Próximos pasos:
echo 1. Configurar MySQL:
echo    - Crear base de datos: CREATE DATABASE gana_tu_colegio;
echo    - Verificar credenciales en Backend\.env
echo.
echo 2. Ejecutar el sistema:
echo    Terminal 1: cd Backend ^&^& npm run dev
echo    Terminal 2: cd frontend ^&^& npm start
echo.
echo 3. Acceder a la aplicación:
echo    Frontend: http://localhost:4200
echo    Backend:  http://localhost:3000/api
echo.
echo 📚 Documentación completa en README.md
echo.
echo ¡Buena suerte con tu proyecto! 🚀
pause







