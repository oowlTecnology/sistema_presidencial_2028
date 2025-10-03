-- Crear tabla Fidelizacion
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Fidelizacion]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Fidelizacion] (
        [id] INT IDENTITY(1,1) PRIMARY KEY,
        [cedula] VARCHAR(11) NOT NULL,
        [coordinadorId] INT NOT NULL,
        [colegioId] INT NULL,
        [fechaFidelizacion] DATETIME2 DEFAULT GETDATE(),
        
        CONSTRAINT FK_Fidelizacion_Coordinador FOREIGN KEY (coordinadorId) 
            REFERENCES [dbo].[users](id),
        CONSTRAINT FK_Fidelizacion_Cedula FOREIGN KEY (cedula) 
            REFERENCES [dbo].[Padron](cedula),
        CONSTRAINT UQ_Fidelizacion_Cedula UNIQUE (cedula)
    );
    
    CREATE INDEX IX_Fidelizacion_Cedula ON [dbo].[Fidelizacion](cedula);
    CREATE INDEX IX_Fidelizacion_ColegioId ON [dbo].[Fidelizacion](colegioId);
    CREATE INDEX IX_Fidelizacion_CoordinadorId ON [dbo].[Fidelizacion](coordinadorId);
    
    PRINT 'Tabla Fidelizacion creada exitosamente';
END
ELSE
BEGIN
    PRINT 'La tabla Fidelizacion ya existe';
END
GO
