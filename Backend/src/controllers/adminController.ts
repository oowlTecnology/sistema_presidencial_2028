import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { User, UserRole } from '../entities/User'
import { AuthRequest } from '../middleware/auth'
import bcrypt from 'bcryptjs'

export class AdminController {
  // Obtener todos los usuarios (sin restricciones de jerarquía)
  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User)
      const users = await userRepository.find({
        relations: ['provincia', 'municipio', 'circunscripcion', 'colegio', 'recinto'],
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'role',
          'isActive',
          'phoneNumber',
          'address',
          'provinciaId',
          'municipioId',
          'circunscripcionId',
          'colegioId',
          'recintoId',
          'createdAt',
          'updatedAt'
        ],
        order: { createdAt: 'DESC' }
      })

      res.json(users)
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  // Cambiar contraseña de cualquier usuario
  async changeUserPassword(req: AuthRequest, res: Response) {
    try {
      const { userId, newPassword } = req.body

      if (!userId || !newPassword) {
        return res.status(400).json({ message: 'userId y newPassword son requeridos' })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
      }

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { id: userId } })

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      // Hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      user.password = hashedPassword

      await userRepository.save(user)

      res.json({ 
        message: 'Contraseña actualizada exitosamente',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      })
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  // Cambiar rol de cualquier usuario
  async changeUserRole(req: AuthRequest, res: Response) {
    try {
      const { userId, newRole, provinciaId, municipioId, circunscripcionId, colegioId, recintoId } = req.body

      if (!userId || !newRole) {
        return res.status(400).json({ message: 'userId y newRole son requeridos' })
      }

      // Validar que el rol sea válido
      const validRoles = Object.values(UserRole)
      if (!validRoles.includes(newRole)) {
        return res.status(400).json({ 
          message: 'Rol inválido',
          validRoles 
        })
      }

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { id: userId } })

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      // Prevenir que el super admin se quite su propio rol
      if (user.id === req.user?.id && user.role === UserRole.SUPER_ADMIN && newRole !== UserRole.SUPER_ADMIN) {
        return res.status(400).json({ 
          message: 'No puedes quitarte el rol de Super Admin a ti mismo' 
        })
      }

      // Actualizar rol y asignar IDs según el nuevo rol
      const updateData: any = {
        role: newRole,
        provinciaId: null,
        municipioId: null,
        circunscripcionId: null,
        colegioId: null,
        recintoId: null
      }

      // Asignar IDs según el nuevo rol
      if (newRole === UserRole.PROVINCIAL && provinciaId) {
        updateData.provinciaId = provinciaId
      } else if (newRole === UserRole.MUNICIPAL && municipioId) {
        updateData.provinciaId = provinciaId
        updateData.municipioId = municipioId
      } else if (newRole === UserRole.CIRCUNSCRIPCION && circunscripcionId) {
        updateData.provinciaId = provinciaId
        updateData.circunscripcionId = circunscripcionId
      } else if (newRole === UserRole.COLEGIO && colegioId) {
        updateData.colegioId = colegioId
      } else if (newRole === UserRole.RECINTO && recintoId) {
        updateData.recintoId = recintoId
      }

      await userRepository.update(userId, updateData)

      res.json({ 
        message: 'Rol actualizado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          provinciaId: user.provinciaId,
          municipioId: user.municipioId,
          circunscripcionId: user.circunscripcionId,
          colegioId: user.colegioId,
          recintoId: user.recintoId
        }
      })
    } catch (error) {
      console.error('Error al cambiar rol:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  // Activar/Desactivar usuario
  async toggleUserStatus(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params
      const { isActive } = req.body

      if (isActive === undefined) {
        return res.status(400).json({ message: 'isActive es requerido' })
      }

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { id: parseInt(userId) } })

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      // Prevenir que el super admin se desactive a sí mismo
      if (user.id === req.user?.id && !isActive) {
        return res.status(400).json({ 
          message: 'No puedes desactivarte a ti mismo' 
        })
      }

      user.isActive = isActive
      await userRepository.save(user)

      res.json({ 
        message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive
        }
      })
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  // Eliminar usuario permanentemente
  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { id: parseInt(userId) } })

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      // Prevenir que el super admin se elimine a sí mismo
      if (user.id === req.user?.id) {
        return res.status(400).json({ 
          message: 'No puedes eliminarte a ti mismo' 
        })
      }

      await userRepository.remove(user)

      res.json({ message: 'Usuario eliminado exitosamente' })
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
}
