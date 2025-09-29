#!/bin/bash

echo "🏛️ Instalando Gana tu Colegio 2028"
echo "=================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js v18 o superior."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm."
    exit 1
fi

echo "✅ Node.js y npm están instalados"

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd Backend
npm install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp env.example .env
    echo "⚠️  Por favor edita el archivo Backend/.env con tus credenciales de MySQL"
fi

cd ..

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install

cd ..

echo ""
echo "🎉 Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar MySQL:"
echo "   - Crear base de datos: CREATE DATABASE gana_tu_colegio;"
echo "   - Verificar credenciales en Backend/.env"
echo ""
echo "2. Ejecutar el sistema:"
echo "   Terminal 1: cd Backend && npm run dev"
echo "   Terminal 2: cd frontend && npm start"
echo ""
echo "3. Acceder a la aplicación:"
echo "   Frontend: http://localhost:4200"
echo "   Backend:  http://localhost:3000/api"
echo ""
echo "📚 Documentación completa en README.md"
echo ""
echo "¡Buena suerte con tu proyecto! 🚀"






