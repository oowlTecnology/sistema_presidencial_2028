-- Script de configuración de la base de datos para Gana tu Colegio 2028
-- Ejecutar este script en MySQL antes de iniciar la aplicación

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gana_tu_colegio;
USE gana_tu_colegio;

-- Crear usuario (opcional, si quieres usar un usuario específico)
-- CREATE USER 'sa'@'localhost' IDENTIFIED BY '!@Qwerty*';
-- GRANT ALL PRIVILEGES ON gana_tu_colegio.* TO 'sa'@'localhost';
-- FLUSH PRIVILEGES;

-- Las tablas se crearán automáticamente por TypeORM cuando inicies el backend
-- Este script solo crea la base de datos y configura permisos

-- Verificar que la base de datos se creó correctamente
SHOW DATABASES LIKE 'gana_tu_colegio';

-- Mensaje de confirmación
SELECT 'Base de datos gana_tu_colegio creada exitosamente' as mensaje;





