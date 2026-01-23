@echo off
echo ========================================
echo   INSTALACION FUNCIONARIOS PRM
echo   Gana tu Colegio 2028
echo ========================================
echo.

echo [1/5] Verificando estructura de directorios...
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
echo [2/5] Instalando dependencias del Backend...
cd Backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo en instalacion de dependencias del backend
    pause
    exit /b 1
)
echo ✓ Dependencias del Backend instaladas

echo.
echo [3/5] Instalando dependencias del Frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo en instalacion de dependencias del frontend
    pause
    exit /b 1
)
echo ✓ Dependencias del Frontend instaladas

echo.
echo [4/5] Compilando Backend...
cd ..\Backend
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo en compilacion del backend
    pause
    exit /b 1
)
echo ✓ Backend compilado correctamente

echo.
echo [5/5] Verificando archivos de integracion...
if not exist "src\entities\Funcionario.ts" (
    echo ERROR: Entidad Funcionario no encontrada
    pause
    exit /b 1
)
if not exist "src\controllers\funcionarioController.ts" (
    echo ERROR: Controlador Funcionario no encontrado
    pause
    exit /b 1
)
if not exist "src\routes\funcionarios.ts" (
    echo ERROR: Rutas Funcionarios no encontradas
    pause
    exit /b 1
)
if not exist "src\migrations\create-funcionarios-table.sql" (
    echo ERROR: Migracion de base de datos no encontrada
    pause
    exit /b 1
)
echo ✓ Archivos de integracion verificados

cd ..
if not exist "frontend\src\app\components\funcionarios\funcionarios.component.ts" (
    echo ERROR: Componente Frontend Funcionarios no encontrado
    pause
    exit /b 1
)
if not exist "frontend\src\app\services\funcionarios.service.ts" (
    echo ERROR: Servicio Frontend Funcionarios no encontrado
    pause
    exit /b 1
)
echo ✓ Componentes Frontend verificados

echo.
echo ========================================
echo   INSTALACION COMPLETADA
echo ========================================
echo.
echo PROXIMOS PASOS:
echo.
echo 1. Ejecutar migracion de base de datos:
echo    - Abrir SQL Server Management Studio
echo    - Conectar a la base de datos
echo    - Ejecutar: Backend\src\migrations\create-funcionarios-table.sql
echo.
echo 2. Crear usuario con rol 'funcionarios':
echo    - Usar el panel de administracion
echo    - O ejecutar endpoint POST /auth/register con role: 'funcionarios'
echo.
echo 3. Iniciar los servicios:
echo    Backend:  cd Backend ^&^& npm run dev
echo    Frontend: cd frontend ^&^& npm start
echo.
echo 4. Acceder a Funcionarios PRM:
echo    - Login con usuario rol 'funcionarios' o 'super_admin'
echo    - Navegar a /funcionarios
echo.
echo Para mas informacion consultar: INTEGRACION_FUNCIONARIOS_PRM.md
echo.
pause
