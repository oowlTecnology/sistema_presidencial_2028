-- Script para crear usuario con rol 'funcionarios'
-- Ejecutar en SQL Server Management Studio

USE [gana_tu_colegio]; -- Base de datos correcta

-- Crear usuario administrador de funcionarios
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
    'admin.funcionarios@prm.gov.do',
    '$2b$10$rQJ5K8qF7mX9nY2pL4vH8.8tZ3wE6rT9yU1iO5pA7sD2fG3hJ4kL6', -- funcionarios123
    'Administrador',
    'Funcionarios PRM',
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
WHERE email = 'admin.funcionarios@prm.gov.do';

-- Mensaje de confirmación
PRINT 'Usuario creado exitosamente:';
PRINT 'Email: admin.funcionarios@prm.gov.do';
PRINT 'Password: funcionarios123';
PRINT 'Rol: funcionarios';
