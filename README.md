# 🏛️ Gana tu Colegio 2028

Plataforma de coordinación política territorial con sistema jerárquico de roles para la gestión de coordinadores y personas en la estructura política del país.

## 🎯 Descripción del Proyecto

Esta plataforma permite la gestión jerárquica de coordinadores políticos en la estructura territorial:

**Provincia → Municipio → Colegio → Recinto**

Cada nivel tiene sus propias responsabilidades y permisos, con dashboards personalizados y gestión de usuarios restringida según el rol.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────┐
│                Frontend                 │
│           Angular 18 + Material        │
├─────────────────────────────────────────┤
│                Backend                  │
│        Node.js + Express + TypeORM     │
├─────────────────────────────────────────┤
│              Base de Datos              │
│              MySQL Local                │
└─────────────────────────────────────────┘
```

## 👥 Estructura de Roles

### 🏛️ Coordinador Provincial
- **Puede ver:** Todo el sistema
- **Puede hacer:** Crear coordinadores municipales, ver todas las estadísticas
- **Dashboard:** Vista completa con métricas generales

### 🏘️ Coordinador Municipal  
- **Puede ver:** Su municipio y todo lo que contiene
- **Puede hacer:** Crear coordinadores de colegio y recinto
- **Dashboard:** Vista municipal con estadísticas locales

### 🏫 Coordinador de Colegio
- **Puede ver:** Su colegio y todos los recintos
- **Puede hacer:** Crear coordinadores de recinto
- **Dashboard:** Vista del colegio con gestión de recintos

### 🏠 Coordinador de Recinto
- **Puede ver:** Solo su recinto
- **Puede hacer:** Registrar y gestionar personas
- **Dashboard:** Vista del recinto con registro de personas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- MySQL Server
- npm o yarn

### 1. Configurar Base de Datos MySQL

```sql
-- Crear base de datos
CREATE DATABASE gana_tu_colegio;

-- Usuario con permisos (ya configurado en el proyecto)
-- Username: sa
-- Password: !@Qwerty*
```

### 2. Configurar Backend

```bash
cd Backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env

# Editar .env con tus credenciales de MySQL
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar API URL en src/environments/environment.ts
```

### 4. Ejecutar el Sistema

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

## 🌐 URLs del Sistema

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health

## 📊 Funcionalidades Principales

### 🔐 Sistema de Autenticación
- Registro e inicio de sesión
- JWT tokens para seguridad
- Protección de rutas por rol
- Interceptores automáticos

### 📈 Dashboards Personalizados
- **Provincial:** Vista completa del sistema
- **Municipal:** Gestión municipal
- **Colegio:** Gestión de colegio
- **Recinto:** Registro de personas

### 👥 Gestión de Usuarios
- Crear coordinadores según jerarquía
- Editar información de usuarios
- Activar/desactivar usuarios
- Permisos restringidos por rol

### 📝 Registro de Personas
- Registro de personas por recinto
- Estados: Contactado, Convencido, Voluntario, Apoyo
- Notas y seguimiento
- Filtros por coordinador

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeORM** - ORM para TypeScript
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación
- **bcryptjs** - Encriptación
- **TypeScript** - Tipado estático

### Frontend
- **Angular 18** - Framework frontend
- **Angular Material** - Componentes UI
- **TypeScript** - Tipado estático
- **RxJS** - Programación reactiva
- **SCSS** - Estilos

## 📁 Estructura del Proyecto

```
Gana tu colegio 2028/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── entities/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.ts
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── guards/
│   │   │   ├── services/
│   │   │   └── models/
│   │   └── environments/
│   ├── package.json
│   └── README.md
└── README.md
```

## 🔒 Seguridad

- Autenticación JWT
- Contraseñas encriptadas con bcrypt
- Validación de datos en backend y frontend
- Guards de ruta en Angular
- Permisos jerárquicos por rol

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Dispositivos móviles
- 💻 Tablets  
- 🖥️ Escritorio

## 🚀 Despliegue

### Backend (Producción)
```bash
cd Backend
npm run build
npm start
```

### Frontend (Producción)
```bash
cd frontend
npm run build
# Desplegar archivos de dist/gana-tu-colegio/
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, por favor contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para la coordinación política territorial**







