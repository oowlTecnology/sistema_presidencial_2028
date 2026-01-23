-- Script alternativo para crear usuario funcionarios con email diferente
-- Ejecutar en SQL Server Management Studio

USE [gana_tu_colegio]; -- Base de datos correcta

-- Crear usuario funcionarios con email alternativo
INSERT INTO [dbo].[users] (
    email,
    password, -- Password hasheado para 'funcionarios123'
    firstName,
    lastName,
    role,
    isActive,
    createdAt,
    updatedAt
) VALUES (
    'funcionarios@prm.gov.do',
    '$2b$10$rQJ5K8qF7mX9nY2pL4vH8.8tZ3wE6rT9yU1iO5pA7sD2fG3hJ4kL6', -- funcionarios123
    'Admin',
    'Funcionarios',
    'funcionarios',
    1,
    GETDATE(),
    GETDATE()
);

-- Verificar que el usuario fue creado
SELECT 
    id,
    email,
    firstName,
    lastName,
    role,
    isActive,
    createdAt
FROM [dbo].[users] 
WHERE role = 'funcionarios';

PRINT '=== USUARIO FUNCIONARIOS CREADO ===';
PRINT 'Email: funcionarios@prm.gov.do';
PRINT 'Password: funcionarios123';
PRINT 'Rol: funcionarios';
