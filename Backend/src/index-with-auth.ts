import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

// Base de datos simulada en memoria (para pruebas)
let users: any[] = [];
let nextId = 1;

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Gana tu Colegio 2028',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health'
    }
  });
});

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// RUTAS DE AUTENTICACIÓN

// Registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear nuevo usuario
    const newUser = {
      id: nextId++,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'recinto',
      isActive: true,
      createdAt: new Date()
    };

    users.push(newUser);

    // Crear token JWT
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key-for-development';
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Remover la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const user = users.find(u => u.email === email && u.isActive);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Crear token JWT
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key-for-development';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Remover la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener usuarios (para el dashboard)
app.get('/api/users', (req, res) => {
  try {
    // Filtrar contraseñas de la respuesta
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
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
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Base de datos: ${process.env.DB_DATABASE || 'gana_tu_colegio'}`);
  console.log(`🔐 Autenticación: Habilitada`);
});

export default app;







