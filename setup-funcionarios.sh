#!/bin/bash

echo "========================================"
echo "   INSTALACION FUNCIONARIOS PRM"
echo "   Gana tu Colegio 2028"
echo "========================================"
echo

echo "[1/5] Verificando estructura de directorios..."
if [ ! -d "Backend" ]; then
    echo "ERROR: Directorio Backend no encontrado"
    exit 1
fi
if [ ! -d "frontend" ]; then
    echo "ERROR: Directorio frontend no encontrado"
    exit 1
fi
echo "✓ Estructura de directorios OK"

echo
echo "[2/5] Instalando dependencias del Backend..."
cd Backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Fallo en instalacion de dependencias del backend"
    exit 1
fi
echo "✓ Dependencias del Backend instaladas"

echo
echo "[3/5] Instalando dependencias del Frontend..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Fallo en instalacion de dependencias del frontend"
    exit 1
fi
echo "✓ Dependencias del Frontend instaladas"

echo
echo "[4/5] Compilando Backend..."
cd ../Backend
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Fallo en compilacion del backend"
    exit 1
fi
echo "✓ Backend compilado correctamente"

echo
echo "[5/5] Verificando archivos de integracion..."
if [ ! -f "src/entities/Funcionario.ts" ]; then
    echo "ERROR: Entidad Funcionario no encontrada"
    exit 1
fi
if [ ! -f "src/controllers/funcionarioController.ts" ]; then
    echo "ERROR: Controlador Funcionario no encontrado"
    exit 1
fi
if [ ! -f "src/routes/funcionarios.ts" ]; then
    echo "ERROR: Rutas Funcionarios no encontradas"
    exit 1
fi
if [ ! -f "src/migrations/create-funcionarios-table.sql" ]; then
    echo "ERROR: Migracion de base de datos no encontrada"
    exit 1
fi
echo "✓ Archivos de integracion verificados"

cd ..
if [ ! -f "frontend/src/app/components/funcionarios/funcionarios.component.ts" ]; then
    echo "ERROR: Componente Frontend Funcionarios no encontrado"
    exit 1
fi
if [ ! -f "frontend/src/app/services/funcionarios.service.ts" ]; then
    echo "ERROR: Servicio Frontend Funcionarios no encontrado"
    exit 1
fi
echo "✓ Componentes Frontend verificados"

echo
echo "========================================"
echo "   INSTALACION COMPLETADA"
echo "========================================"
echo
echo "PROXIMOS PASOS:"
echo
echo "1. Ejecutar migracion de base de datos:"
echo "   - Conectar a SQL Server"
echo "   - Ejecutar: Backend/src/migrations/create-funcionarios-table.sql"
echo
echo "2. Crear usuario con rol 'funcionarios':"
echo "   - Usar el panel de administracion"
echo "   - O ejecutar endpoint POST /auth/register con role: 'funcionarios'"
echo
echo "3. Iniciar los servicios:"
echo "   Backend:  cd Backend && npm run dev"
echo "   Frontend: cd frontend && npm start"
echo
echo "4. Acceder a Funcionarios PRM:"
echo "   - Login con usuario rol 'funcionarios' o 'super_admin'"
echo "   - Navegar a /funcionarios"
echo
echo "Para mas informacion consultar: INTEGRACION_FUNCIONARIOS_PRM.md"
echo
