-- Crear tabla funcionarios
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[funcionarios]') AND type in (N'U'))
BEGIN
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
    
    -- Crear índices para mejorar el rendimiento
    CREATE INDEX IX_funcionarios_municipioId ON [dbo].[funcionarios](municipioId);
    CREATE INDEX IX_funcionarios_cedula ON [dbo].[funcionarios](cedula);
    CREATE INDEX IX_funcionarios_nombre ON [dbo].[funcionarios](nombre);
    CREATE INDEX IX_funcionarios_cargo ON [dbo].[funcionarios](cargo);
    
    PRINT 'Tabla funcionarios creada exitosamente';
END
ELSE
BEGIN
    PRINT 'La tabla funcionarios ya existe';
END
GO
