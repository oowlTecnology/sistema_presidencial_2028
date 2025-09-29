# Gana tu Colegio 2028 - Frontend

Frontend para la plataforma de coordinación política territorial desarrollado con Angular 18.

## Características

- ✅ Angular 18 con arquitectura standalone
- ✅ Material Design con Angular Material
- ✅ Sistema de autenticación JWT
- ✅ Dashboards personalizados por rol
- ✅ Gestión de usuarios con permisos
- ✅ Responsive design
- ✅ Interceptores HTTP para autenticación
- ✅ Guards de ruta para protección

## Estructura de Roles y Dashboards

### Provincial Dashboard
- 🏛️ Vista completa de toda la estructura
- 📊 Estadísticas de coordinadores por nivel
- 👥 Gestión de usuarios de todos los niveles
- 📈 Reportes generales

### Municipal Dashboard
- 🏘️ Vista de municipio y sus colegios
- 📊 Estadísticas municipales
- 🏫 Gestión de colegios y recintos
- 👥 Gestión de coordinadores municipales

### Colegio Dashboard
- 🏫 Vista del colegio y sus recintos
- 📊 Estadísticas del colegio
- 👥 Gestión de coordinadores de recinto
- 📝 Registro de personas

### Recinto Dashboard
- 🏠 Vista del recinto
- 📊 Estadísticas del recinto
- 👥 Registro y gestión de personas
- 📈 Progreso hacia metas

## Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar la API:**
Editar `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

3. **Ejecutar el servidor de desarrollo:**
```bash
npm start
# o
ng serve
```

4. **Abrir en el navegador:**
```
http://localhost:4200
```

## Scripts Disponibles

- `npm start` - Ejecutar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run serve` - Servir y abrir en navegador
- `npm test` - Ejecutar pruebas unitarias

## Tecnologías Utilizadas

- **Angular 18** - Framework frontend
- **Angular Material** - Componentes UI
- **TypeScript** - Tipado estático
- **RxJS** - Programación reactiva
- **SCSS** - Estilos con sintaxis SASS

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   └── login.component.ts
│   │   ├── register/
│   │   │   └── register.component.ts
│   │   ├── dashboard/
│   │   │   ├── provincial-dashboard/
│   │   │   ├── municipal-dashboard/
│   │   │   ├── colegio-dashboard/
│   │   │   └── recinto-dashboard/
│   │   └── users/
│   │       └── users.component.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── app.component.ts
│   └── app.routes.ts
├── environments/
│   └── environment.ts
├── index.html
├── main.ts
└── styles.scss
```

## Funcionalidades por Rol

### Autenticación
- 🔐 Login con email y contraseña
- 📝 Registro de nuevos usuarios
- 🔒 Protección de rutas con guards
- 🎫 Interceptor automático para JWT

### Dashboard Provincial
- 📊 Métricas generales del sistema
- 👥 Gestión completa de usuarios
- 📈 Estadísticas de coordinadores
- 🎯 Acceso a todas las funciones

### Dashboard Municipal
- 🏘️ Vista del municipio asignado
- 📊 Métricas municipales
- 🏫 Gestión de colegios
- 👥 Gestión de coordinadores municipales

### Dashboard de Colegio
- 🏫 Vista del colegio asignado
- 📊 Métricas del colegio
- 🏠 Gestión de recintos
- 👥 Gestión de coordinadores de recinto

### Dashboard de Recinto
- 🏠 Vista del recinto asignado
- 👥 Registro de personas
- 📊 Métricas del recinto
- 🎯 Progreso hacia metas

### Gestión de Usuarios
- ➕ Crear nuevos usuarios (según permisos)
- ✏️ Editar usuarios existentes
- 🗑️ Eliminar usuarios (solo provincial)
- 👀 Ver lista filtrada por rol

## Características Técnicas

### Guards de Ruta
- `authGuard` - Verifica autenticación
- `roleGuard` - Verifica permisos por rol

### Interceptores
- `authInterceptor` - Agrega token JWT automáticamente

### Servicios
- `AuthService` - Manejo de autenticación
- `UserService` - Gestión de usuarios

### Modelos
- `User` - Modelo de usuario
- `UserRole` - Enum de roles
- `LoginRequest` - Modelo de login
- `RegisterRequest` - Modelo de registro

## Responsive Design

La aplicación está optimizada para:
- 📱 Dispositivos móviles
- 💻 Tablets
- 🖥️ Escritorio

## Temas y Estilos

- 🎨 Material Design
- 🌈 Colores diferenciados por rol
- 📐 Layout responsivo
- ✨ Animaciones suaves

## Desarrollo

Para desarrollo con hot reload:

```bash
npm start
```

Para construir para producción:

```bash
npm run build
```

Los archivos de producción se generan en `dist/gana-tu-colegio/`

## Configuración de Producción

1. Actualizar `environment.prod.ts` con la URL del API de producción
2. Ejecutar `npm run build`
3. Desplegar los archivos de `dist/gana-tu-colegio/`

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request






