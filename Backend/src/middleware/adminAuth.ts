import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth'
import { UserRole } from '../entities/User'

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' })
  }

  if (req.user.role !== UserRole.SUPER_ADMIN) {
    return res.status(403).json({ 
      message: 'Acceso denegado. Solo Super Administradores pueden acceder a esta función.' 
    })
  }

  next()
}
