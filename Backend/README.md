# Gana tu Colegio 2028 - Backend

Backend para la plataforma de coordinación política territorial desarrollado con Node.js, Express, TypeORM y MySQL.

## Características

- ✅ Autenticación JWT
- ✅ Sistema de roles jerárquico (Provincial → Municipal → Colegio → Recinto)
- ✅ Gestión de usuarios con permisos restringidos
- ✅ API RESTful completa
- ✅ Validación de datos con class-validator
- ✅ Base de datos MySQL con TypeORM

## Estructura de Roles

```
Provincial (Puede ver todo)
├── Municipal (Puede gestionar su municipio)
    ├── Colegio (Puede gestionar su colegio)
        └── Recinto (Puede gestionar su recinto)
```

## Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp env.example .env
```

Editar el archivo `.env` con tus credenciales de MySQL:
```
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

3. **Crear la base de datos MySQL:**
```sql
CREATE DATABASE gana_tu_colegio;
```

4. **Ejecutar el servidor:**
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Obtener perfil del usuario

### Usuarios
- `GET /api/users` - Listar usuarios (filtrado por rol)
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (solo provincial)

### Personas
- `GET /api/personas` - Listar personas (filtrado por rol)
- `POST /api/personas` - Registrar persona
- `PUT /api/personas/:id` - Actualizar persona
- `DELETE /api/personas/:id` - Eliminar persona

### Sistema
- `GET /api/health` - Estado del servidor

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeORM** - ORM para TypeScript
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **class-validator** - Validación de datos
- **TypeScript** - Tipado estático

## Estructura del Proyecto

```
src/
├── config/
│   └── database.ts          # Configuración de la base de datos
├── controllers/
│   ├── authController.ts    # Controlador de autenticación
│   ├── userController.ts    # Controlador de usuarios
│   └── personaController.ts # Controlador de personas
├── entities/
│   ├── User.ts             # Entidad Usuario
│   ├── Provincia.ts        # Entidad Provincia
│   ├── Municipio.ts        # Entidad Municipio
│   ├── Colegio.ts          # Entidad Colegio
│   ├── Recinto.ts          # Entidad Recinto
│   └── Persona.ts          # Entidad Persona
├── middleware/
│   └── auth.ts             # Middleware de autenticación
├── routes/
│   ├── auth.ts             # Rutas de autenticación
│   ├── users.ts            # Rutas de usuarios
│   ├── personas.ts         # Rutas de personas
│   └── index.ts            # Rutas principales
└── index.ts                # Punto de entrada
```

## Permisos por Rol

### Provincial
- ✅ Puede ver y gestionar todo
- ✅ Puede crear usuarios de cualquier nivel
- ✅ Puede eliminar usuarios
- ✅ Ve todas las estadísticas

### Municipal
- ✅ Puede ver usuarios de su municipio
- ✅ Puede crear coordinadores de colegio y recinto
- ✅ Puede actualizar usuarios de su área

### Colegio
- ✅ Puede ver usuarios de su colegio
- ✅ Puede crear coordinadores de recinto
- ✅ Puede actualizar usuarios de su área

### Recinto
- ✅ Puede ver solo su información
- ✅ Puede registrar personas
- ✅ Puede gestionar personas que registró

## Desarrollo

Para desarrollo, el servidor se reinicia automáticamente cuando detecta cambios:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Producción

Para producción:

```bash
npm run build
npm start
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request






