import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
      relations: ['provincia', 'municipio', 'colegio', 'recinto']
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Usuario no válido o inactivo' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
    }

    next();
  };
};

export const canAccessUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  const targetUserId = parseInt(req.params.id);
  const currentUser = req.user;

  // El usuario puede acceder a su propia información
  if (currentUser.id === targetUserId) {
    return next();
  }

  // El provincial puede ver todo
  if (currentUser.role === 'provincial') {
    return next();
  }

  // El municipal puede ver usuarios de su municipio
  if (currentUser.role === 'municipal' && currentUser.municipioId) {
    // Aquí podrías verificar si el usuario objetivo pertenece al mismo municipio
    return next();
  }

  // El de circunscripción puede ver usuarios de su circunscripción
  if (currentUser.role === 'circunscripcion' && currentUser.circunscripcionId) {
    // Aquí podrías verificar si el usuario objetivo pertenece a la misma circunscripción
    return next();
  }

  // El de colegio puede ver usuarios de su colegio
  if (currentUser.role === 'colegio' && currentUser.colegioId) {
    // Aquí podrías verificar si el usuario objetivo pertenece al mismo colegio
    return next();
  }

  return res.status(403).json({ message: 'No tienes permisos para acceder a este usuario' });
};
