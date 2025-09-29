# 🚀 Guía de Inicio Rápido - Gana tu Colegio 2028

## ⚡ Instalación en 5 minutos

### 1. 📋 Prerrequisitos
- ✅ Node.js v18 o superior
- ✅ MySQL Server
- ✅ Git (opcional)

### 2. 🗄️ Configurar MySQL

```sql
-- Ejecutar en MySQL
CREATE DATABASE gana_tu_colegio;
```

O ejecutar el script incluido:
```bash
mysql -u root -p < database-setup.sql
```

### 3. 🛠️ Instalar el Proyecto

**Windows:**
```cmd
install.bat
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

**Manual:**
```bash
# Backend
cd Backend
npm install
cp env.example .env

# Frontend  
cd ../frontend
npm install
```

### 4. ⚙️ Configurar Variables de Entorno

Editar `Backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=sa
DB_PASSWORD=!@Qwerty*
DB_DATABASE=gana_tu_colegio
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
```

### 5. 🚀 Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 6. 🌐 Acceder a la Aplicación

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health

## 👤 Primer Usuario

1. Ve a http://localhost:4200
2. Haz clic en "Regístrate aquí"
3. Completa el formulario de registro
4. Selecciona el rol "Coordinador Provincial" para acceso completo
5. Inicia sesión y explora el dashboard

## 🎯 Funcionalidades Principales

### 🔐 Autenticación
- Registro e inicio de sesión
- Protección de rutas por rol
- Tokens JWT seguros

### 📊 Dashboards por Rol
- **Provincial:** Vista completa del sistema
- **Municipal:** Gestión municipal
- **Colegio:** Gestión de colegio  
- **Recinto:** Registro de personas

### 👥 Gestión de Usuarios
- Crear coordinadores según jerarquía
- Editar información de usuarios
- Permisos restringidos por rol

## 🏗️ Estructura de Roles

```
Provincial (Puede ver todo)
├── Municipal (Puede gestionar su municipio)
    ├── Colegio (Puede gestionar su colegio)
        └── Recinto (Puede gestionar su recinto)
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev          # Backend con hot reload
npm start            # Frontend con hot reload

# Producción
npm run build        # Compilar backend
npm run build        # Compilar frontend

# Base de datos
npm run migration:generate  # Generar migración
npm run migration:run       # Ejecutar migraciones
```

## 🆘 Solución de Problemas

### Error de conexión a MySQL
- Verifica que MySQL esté ejecutándose
- Confirma credenciales en `.env`
- Verifica que la base de datos existe

### Error de puertos ocupados
- Cambia el puerto en `Backend/.env` (PORT=3001)
- Actualiza `frontend/src/environments/environment.ts`

### Error de dependencias
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

- 📚 Documentación completa: `README.md`
- 🐛 Reportar bugs: Crear issue en GitHub
- 💡 Sugerencias: Crear feature request

## 🎉 ¡Listo!

Tu plataforma de coordinación política está funcionando. ¡Comienza a registrar coordinadores y personas!

---

**Desarrollado con ❤️ para la coordinación política territorial**






