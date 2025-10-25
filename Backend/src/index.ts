import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { initializeDatabase } from './config/database';
import routes from './routes';

// Cargar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', routes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Gana tu Colegio 2028',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Inicializar base de datos
    await initializeDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Base de datos: ${process.env.DB_DATABASE || 'gana_tu_colegio'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;







