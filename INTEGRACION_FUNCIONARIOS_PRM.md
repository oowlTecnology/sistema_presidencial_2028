# Integración de Funcionarios PRM con Gana tu Colegio 2028

## Resumen de la Integración

Se ha completado exitosamente la integración del sistema **Funcionarios PRM** dentro del sistema **Gana tu Colegio 2028**. Esta integración permite gestionar funcionarios públicos utilizando el sistema de autenticación y roles existente de Gana tu Colegio.

## Cambios Realizados

### Backend

#### 1. Nuevas Entidades
- **Funcionario** (`src/entities/Funcionario.ts`)
  - Campos: id, cargo, nombre, cedula, telefono, foto, municipioId
  - Relación con Municipio
  - Métodos getter para manejo de imágenes

#### 2. Nuevo Controlador
- **FuncionarioController** (`src/controllers/funcionarioController.ts`)
  - CRUD completo para funcionarios
  - Filtrado por municipio y provincia
  - Control de acceso basado en roles
  - Soporte para imágenes en base64

#### 3. Nuevas Rutas
- **funcionarios** (`src/routes/funcionarios.ts`)
  - GET `/funcionarios` - Listar funcionarios
  - GET `/funcionarios/municipio/:municipioId` - Funcionarios por municipio
  - GET `/funcionarios/:id` - Funcionario específico
  - POST `/funcionarios` - Crear funcionario (solo admin/funcionarios)
  - PUT `/funcionarios/:id` - Actualizar funcionario (solo admin/funcionarios)
  - DELETE `/funcionarios/:id` - Eliminar funcionario (solo admin/funcionarios)

#### 4. Actualización de Roles
- Añadido rol `FUNCIONARIOS` al enum UserRole
- Actualizado sistema de autenticación para soportar el nuevo rol

#### 5. Configuración de Base de Datos
- Entidad Funcionario añadida a TypeORM
- Migración SQL creada (`src/migrations/create-funcionarios-table.sql`)

### Frontend

#### 1. Nuevo Servicio
- **FuncionariosService** (`src/app/services/funcionarios.service.ts`)
  - Métodos para CRUD de funcionarios
  - Integración con API REST

#### 2. Nuevo Componente
- **FuncionariosComponent** (`src/app/components/funcionarios/`)
  - Lista de funcionarios con filtros
  - Búsqueda por texto
  - Filtros por provincia y municipio
  - Interfaz responsive con Angular Material

#### 3. Actualización de Rutas
- Ruta `/funcionarios` añadida con protección de roles
- Ruta dentro del dashboard para usuarios con rol funcionarios

#### 4. Actualización de Modelos
- Añadido rol `FUNCIONARIOS` al enum UserRole del frontend

#### 5. Navegación
- Botón de acceso a Funcionarios PRM en dashboard ejecutivo
- Acceso controlado por roles

## Estructura de Permisos

### Roles con Acceso a Funcionarios
- **super_admin**: Acceso completo (CRUD)
- **funcionarios**: Acceso completo (CRUD)
- **provincial**: Solo lectura de funcionarios de su provincia
- **municipal**: Solo lectura de funcionarios de su municipio

### Restricciones de Acceso
- Los usuarios provinciales solo pueden ver funcionarios de su provincia
- Los usuarios municipales solo pueden ver funcionarios de su municipio
- Solo super_admin y funcionarios pueden crear, editar y eliminar funcionarios

## Base de Datos

### Nueva Tabla: funcionarios
```sql
CREATE TABLE [dbo].[funcionarios] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [cargo] VARCHAR(200) NOT NULL,
    [nombre] VARCHAR(200) NULL,
    [cedula] VARCHAR(200) NOT NULL,
    [telefono] VARCHAR(200) NULL,
    [foto] VARBINARY(MAX) NULL,
    [municipioId] SMALLINT NULL,
    [createdAt] DATETIME2 DEFAULT GETDATE(),
    [updatedAt] DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_funcionarios_municipio FOREIGN KEY (municipioId) 
        REFERENCES [dbo].[Municipio](ID) ON DELETE SET NULL ON UPDATE CASCADE
);
```

### Índices Creados
- `IX_funcionarios_municipioId`
- `IX_funcionarios_cedula`
- `IX_funcionarios_nombre`
- `IX_funcionarios_cargo`

## Instalación y Configuración

### 1. Backend
```bash
cd Backend
npm install
```

### 2. Ejecutar Migración
```sql
-- Ejecutar el archivo: src/migrations/create-funcionarios-table.sql
```

### 3. Frontend
```bash
cd frontend
npm install
```

### 4. Variables de Entorno
Verificar que el archivo `frontend/src/environments/environment.ts` tenga la URL correcta del API:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Uso del Sistema

### Acceso a Funcionarios PRM
1. Iniciar sesión con un usuario que tenga rol `super_admin` o `funcionarios`
2. En el dashboard ejecutivo, hacer clic en "Funcionarios PRM"
3. O navegar directamente a `/funcionarios`

### Funcionalidades Disponibles
- **Visualización**: Lista de funcionarios con fotos, información de contacto y ubicación
- **Filtros**: Por provincia, municipio y búsqueda de texto
- **Gestión**: Crear, editar y eliminar funcionarios (solo usuarios autorizados)
- **Responsive**: Interfaz adaptable a dispositivos móviles

## Archivos Principales Creados/Modificados

### Backend
- `src/entities/Funcionario.ts` (nuevo)
- `src/controllers/funcionarioController.ts` (nuevo)
- `src/routes/funcionarios.ts` (nuevo)
- `src/routes/index.ts` (modificado)
- `src/config/database.ts` (modificado)
- `src/entities/User.ts` (modificado)
- `src/migrations/create-funcionarios-table.sql` (nuevo)

### Frontend
- `src/app/services/funcionarios.service.ts` (nuevo)
- `src/app/components/funcionarios/` (nuevo directorio completo)
- `src/app/models/user.model.ts` (modificado)
- `src/app/app.routes.ts` (modificado)
- `src/app/components/dashboard/executive-dashboard/executive-dashboard.component.html` (modificado)

## Características Técnicas

### Seguridad
- Autenticación JWT requerida para todas las operaciones
- Control de acceso basado en roles
- Validación de permisos en backend y frontend

### Performance
- Índices en campos de búsqueda frecuente
- Paginación en listados
- Lazy loading de componentes

### UX/UI
- Interfaz consistente con el diseño de Gana tu Colegio
- Material Design components
- Responsive design
- Manejo de estados de carga y error

## Próximos Pasos Sugeridos

1. **Importación de Datos**: Crear script para migrar datos existentes del sistema Funcionarios PRM
2. **Reportes**: Implementar reportes específicos de funcionarios
3. **Notificaciones**: Sistema de notificaciones para cambios en funcionarios
4. **Auditoría**: Log de cambios en registros de funcionarios
5. **Exportación**: Funcionalidad para exportar datos a Excel/PDF

## Soporte y Mantenimiento

Para cualquier consulta o problema relacionado con la integración de Funcionarios PRM:

1. Verificar logs del backend en consola
2. Verificar permisos de usuario
3. Confirmar que la migración de base de datos se ejecutó correctamente
4. Verificar conectividad entre frontend y backend

La integración está completa y lista para uso en producción.
