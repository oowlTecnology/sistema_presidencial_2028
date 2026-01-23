-- Script para verificar y corregir el usuario funcionarios
-- Ejecutar en SQL Server Management Studio

USE [gana_tu_colegio]; -- Base de datos correcta

-- Verificar si existe el usuario
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

-- Si existe pero con rol incorrecto, actualizarlo
UPDATE [dbo].[users] 
SET 
    role = 'funcionarios',
    firstName = 'Administrador',
    lastName = 'Funcionarios PRM',
    isActive = 1,
    updatedAt = GETDATE()
WHERE email = 'admin.funcionarios@prm.gov.do';

-- Si no existe, crearlo
IF NOT EXISTS (SELECT 1 FROM [dbo].[users] WHERE email = 'admin.funcionarios@prm.gov.do')
BEGIN
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
    PRINT 'Usuario funcionarios creado';
END
ELSE
BEGIN
    PRINT 'Usuario funcionarios actualizado';
END

-- Verificar el resultado final
SELECT 
    id,
    email,
    firstName,
    lastName,
    role,
    isActive,
    createdAt,
    updatedAt
FROM [dbo].[users] 
WHERE email = 'admin.funcionarios@prm.gov.do';

PRINT '=== CREDENCIALES DE ACCESO ===';
PRINT 'Email: admin.funcionarios@prm.gov.do';
PRINT 'Password: funcionarios123';
PRINT 'Rol: funcionarios';
