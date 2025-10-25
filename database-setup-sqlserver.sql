-- Script de configuración de la base de datos para Gana tu Colegio 2028 - SQL Server
-- Ejecutar este script en SQL Server Management Studio antes de iniciar la aplicación

-- Crear la base de datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'gana_tu_colegio')
BEGIN
    CREATE DATABASE gana_tu_colegio;
END
GO

USE gana_tu_colegio;
GO

-- Verificar que la base de datos se creó correctamente
SELECT name FROM sys.databases WHERE name = 'gana_tu_colegio';

-- Mensaje de confirmación
SELECT 'Base de datos gana_tu_colegio creada exitosamente en SQL Server' as mensaje;







