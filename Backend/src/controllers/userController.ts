import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { User, UserRole } from '../entities/User'
import { AuthRequest } from '../middleware/auth'
import { validate } from 'class-validator'
import bcrypt from 'bcryptjs'
import { Fidelizacion } from '../entities/Fidelizacion'
import { Padron } from '../entities/Padron'
import { Colegio } from '../entities/Colegio'

export class UserController {
  async getUsers(req: AuthRequest, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User)
      const currentUser = req.user!

      let whereCondition: any = {}
      let relations = ['provincia', 'municipio', 'colegio', 'recinto']

      // Aplicar filtros según el rol del usuario
      switch (currentUser.role) {
        case UserRole.PROVINCIAL:
          // El provincial puede ver todos los usuarios
          break
        case UserRole.MUNICIPAL:
          // El municipal solo ve usuarios de su municipio
          whereCondition = { municipioId: currentUser.municipioId }
          break
        case UserRole.COLEGIO:
          // El de colegio solo ve usuarios de su colegio
          whereCondition = { colegioId: currentUser.colegioId }
          break
        case UserRole.RECINTO:
          // El de recinto solo ve usuarios de su recinto
          whereCondition = { recintoId: currentUser.recintoId }
          break
      }

      const users = await userRepository.find({
        where: whereCondition,
        relations,
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'role',
          'isActive',
          'phoneNumber',
          'address',
          'createdByUserId',
          'createdAt',
        ],
      })

      // Enriquecer con datos del creador
      const creatorIds = Array.from(
        new Set(users.map((u) => u.createdByUserId).filter((id): id is number => !!id))
      )
      let creatorsMap: Record<number, { id: number; firstName: string; lastName: string; email: string }> = {}
      if (creatorIds.length > 0) {
        const creators = await userRepository.find({
          where: creatorIds.map((id) => ({ id })),
          select: ['id', 'firstName', 'lastName', 'email'],
        })
        creatorsMap = Object.fromEntries(
          creators.map((c) => [c.id, { id: c.id, firstName: c.firstName, lastName: c.lastName, email: c.email }])
        )
      }

      const result = users.map((u) => ({
        ...u,
        creator: u.createdByUserId ? creatorsMap[u.createdByUserId] : null,
      }))

      res.json(result)
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  async createUser(req: AuthRequest, res: Response) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role,
        phoneNumber,
        address,
        provinciaId,
        municipioId,
        circunscripcionId,
        colegioId,
        recintoId,
      } = req.body
      const currentUser = req.user!
      const userRepository = AppDataSource.getRepository(User)

      // Verificar si el usuario ya existe
      const existingUser = await userRepository.findOne({ where: { email } })
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' })
      }

      // Validar permisos para crear usuario según rol
      const newUserRole = role as UserRole
      let validatedIds: any = {}

      switch (currentUser.role) {
        case 'provincial':
          // El provincial puede crear usuarios municipales y de circunscripción
          if (newUserRole === UserRole.MUNICIPAL) {
            validatedIds = {
              provinciaId: currentUser.provinciaId,
              municipioId,
            }
          } else if (newUserRole === UserRole.CIRCUNSCRIPCION) {
            validatedIds = {
              provinciaId: currentUser.provinciaId,
              circunscripcionId,
            }
          } else {
            return res.status(403).json({
              message: 'El coordinador provincial solo puede crear coordinadores municipales o de circunscripción',
            })
          }
          break
        case 'municipal':
          // El municipal puede crear usuarios de colegio y recinto en su municipio
          if (newUserRole === 'colegio' || newUserRole === 'recinto') {
            validatedIds = {
              municipioId: currentUser.municipioId,
              colegioId,
              recintoId,
            }
          } else {
            return res.status(403).json({
              message: 'No tienes permisos para crear este tipo de usuario',
            })
          }
          break
        case 'circunscripcion':
          // El de circunscripción puede crear usuarios de colegio y recinto en su circunscripción
          if (newUserRole === 'colegio' || newUserRole === 'recinto') {
            validatedIds = {
              circunscripcionId: currentUser.circunscripcionId,
              colegioId,
              recintoId,
            }
          } else {
            return res.status(403).json({
              message: 'No tienes permisos para crear este tipo de usuario',
            })
          }
          break
        case 'colegio':
          // El de colegio puede crear usuarios de recinto en su colegio
          if (newUserRole === 'recinto') {
            validatedIds = { colegioId: currentUser.colegioId, recintoId }
          } else {
            return res.status(403).json({
              message: 'No tienes permisos para crear este tipo de usuario',
            })
          }
          break
        default:
          return res
            .status(403)
            .json({ message: 'No tienes permisos para crear usuarios' })
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 12)

      // Normalizar IDs a número y validar requisitos por rol
      const norm = (v: any) => (v !== undefined && v !== null ? Number(v) : undefined)

      if (newUserRole === UserRole.MUNICIPAL) {
        // municipioId es obligatorio para usuarios municipales
        const muni = validatedIds.municipioId ?? municipioId
        if (muni === undefined || muni === null) {
          return res.status(400).json({
            message: 'municipioId es requerido para usuarios municipales',
          })
        }
        // provinciaId: usar la del creador si es provincial o la que venga en el body
        validatedIds.provinciaId = validatedIds.provinciaId ?? provinciaId ?? currentUser.provinciaId
      }

      if (newUserRole === UserRole.CIRCUNSCRIPCION) {
        // circunscripcionId es obligatorio para usuarios de circunscripción
        const circ = validatedIds.circunscripcionId ?? circunscripcionId
        if (circ === undefined || circ === null) {
          return res.status(400).json({
            message: 'circunscripcionId es requerido para usuarios de circunscripción',
          })
        }
        // provinciaId: usar la del creador si es provincial
        validatedIds.provinciaId = validatedIds.provinciaId ?? provinciaId ?? currentUser.provinciaId
      }

      const user = userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: newUserRole,
        phoneNumber,
        address,
        isActive: true,
        createdByUserId: currentUser.id,
        provinciaId: norm(validatedIds.provinciaId ?? provinciaId),
        municipioId: norm(validatedIds.municipioId ?? municipioId),
        circunscripcionId: norm(validatedIds.circunscripcionId ?? circunscripcionId),
        colegioId: norm(validatedIds.colegioId ?? colegioId),
        recintoId: norm(validatedIds.recintoId ?? recintoId),
      })

      const errors = await validate(user)
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Datos de usuario inválidos',
          errors: errors.map((error) => Object.values(error.constraints || {})),
        })
      }

      const savedUser = await userRepository.save(user)

      // Crear respuesta sin la contraseña
      const userObj = Array.isArray(savedUser) ? savedUser[0] : savedUser
      const responseUser = {
        id: userObj.id,
        email: userObj.email,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        role: userObj.role,
        phoneNumber: userObj.phoneNumber,
        address: userObj.address,
        isActive: userObj.isActive,
        createdByUserId: userObj.createdByUserId,
        provinciaId: userObj.provinciaId,
        municipioId: userObj.municipioId,
        colegioId: userObj.colegioId,
        recintoId: userObj.recintoId,
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt,
        creator: {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
        },
      }

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        user: responseUser,
      })
    } catch (error) {
      console.error('Error al crear usuario:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const { firstName, lastName, phoneNumber, address, isActive } = req.body
      const currentUser = req.user!
      const userRepository = AppDataSource.getRepository(User)

      const user = await userRepository.findOne({ where: { id: parseInt(id) } })
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      // Verificar permisos para actualizar
      if (
        currentUser.id !== parseInt(id) &&
        currentUser.role !== UserRole.PROVINCIAL
      ) {
        // Verificar si el usuario pertenece a la jerarquía del usuario actual
        let hasPermission = false

        switch (currentUser.role) {
          case UserRole.MUNICIPAL:
            hasPermission = user.municipioId === currentUser.municipioId
            break
          case UserRole.COLEGIO:
            hasPermission = user.colegioId === currentUser.colegioId
            break
          case UserRole.RECINTO:
            hasPermission = user.recintoId === currentUser.recintoId
            break
        }

        if (!hasPermission) {
          return res.status(403).json({
            message: 'No tienes permisos para actualizar este usuario',
          })
        }
      }

      user.firstName = firstName || user.firstName
      user.lastName = lastName || user.lastName
      user.phoneNumber = phoneNumber || user.phoneNumber
      user.address = address || user.address
      user.isActive = isActive !== undefined ? isActive : user.isActive

      const updatedUser = await userRepository.save(user)

      // Crear respuesta sin la contraseña
      const responseUser = {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        isActive: updatedUser.isActive,
        provinciaId: updatedUser.provinciaId,
        municipioId: updatedUser.municipioId,
        colegioId: updatedUser.colegioId,
        recintoId: updatedUser.recintoId,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }

      res.json({
        message: 'Usuario actualizado exitosamente',
        user: responseUser,
      })
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const currentUser = req.user!
      const userRepository = AppDataSource.getRepository(User)

      const user = await userRepository.findOne({ where: { id: parseInt(id) } })
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      // Solo el provincial puede eliminar usuarios
      if (currentUser.role !== UserRole.PROVINCIAL) {
        return res
          .status(403)
          .json({ message: 'No tienes permisos para eliminar usuarios' })
      }

      // No permitir eliminar al propio usuario
      if (currentUser.id === parseInt(id)) {
        return res
          .status(400)
          .json({ message: 'No puedes eliminar tu propia cuenta' })
      }

      await userRepository.remove(user)
      res.json({ message: 'Usuario eliminado exitosamente' })
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  // Obtener estadísticas para el dashboard provincial
  async getEstadisticasProvincial(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id
      const provinciaId = req.user?.provinciaId

      if (!provinciaId) {
        return res.status(400).json({ message: 'provinciaId es requerido' })
      }

      const userRepository = AppDataSource.getRepository(User)
      const fidelizacionRepo = AppDataSource.getRepository(Fidelizacion)

      // Contar coordinadores municipales
      const totalMunicipales = await userRepository.count({
        where: { 
          provinciaId: provinciaId,
          role: UserRole.MUNICIPAL,
          isActive: true
        }
      })

      // Contar coordinadores de colegio
      const totalColegios = await userRepository.count({
        where: { 
          role: UserRole.COLEGIO,
          isActive: true
        }
      })

      // Contar coordinadores de recinto
      const totalRecintos = await userRepository.count({
        where: { 
          role: UserRole.RECINTO,
          isActive: true
        }
      })

      // Obtener coordinadores municipales con sus metas
      const coordinadoresMunicipales = await userRepository.find({
        where: { 
          provinciaId: provinciaId,
          role: UserRole.MUNICIPAL,
          isActive: true
        },
        relations: ['municipio'],
        select: ['id', 'firstName', 'lastName', 'municipioId']
      })

      const padronRepo = AppDataSource.getRepository(Padron)

      // Calcular fidelizaciones por cada coordinador municipal
      const metaMunicipal = 15
      const metasMunicipales = await Promise.all(
        coordinadoresMunicipales.map(async (coord) => {
          const fidelizados = await fidelizacionRepo.count({
            where: { coordinadorId: coord.id }
          })
          
          // Contar personas del municipio en el padrón
          // Como Padron no tiene idmunicipio directamente, contamos a través de los colegios
          let totalPersonasMunicipio = 0
          if (coord.municipioId) {
            const colegioRepo = AppDataSource.getRepository(Colegio)
            
            // Obtener todos los colegios del municipio
            const colegiosMunicipio = await colegioRepo.find({
              where: { IDMunicipio: coord.municipioId },
              select: ['IDColegio']
            })
            
            const colegioIds = colegiosMunicipio.map(c => c.IDColegio)
            
            // Contar personas en esos colegios
            if (colegioIds.length > 0) {
              totalPersonasMunicipio = await padronRepo
                .createQueryBuilder('padron')
                .where('padron.idcolegio IN (:...ids)', { ids: colegioIds })
                .getCount()
            }
          }

          return {
            coordinador: `${coord.firstName} ${coord.lastName}`,
            municipio: coord.municipio?.Descripcion || 'Sin municipio',
            totalPersonasMunicipio,
            fidelizados,
            meta: metaMunicipal,
            porcentaje: Math.round((fidelizados / metaMunicipal) * 100)
          }
        })
      )

      // Obtener coordinadores de colegio con sus metas
      const coordinadoresColegios = await userRepository.find({
        where: { 
          role: UserRole.COLEGIO,
          isActive: true
        },
        select: ['id', 'firstName', 'lastName'],
        take: 10 // Limitar para no sobrecargar
      })

      const metaColegio = 15
      const metasColegios = await Promise.all(
        coordinadoresColegios.map(async (coord) => {
          const fidelizados = await fidelizacionRepo.count({
            where: { coordinadorId: coord.id }
          })
          return {
            coordinador: `${coord.firstName} ${coord.lastName}`,
            fidelizados,
            meta: metaColegio,
            porcentaje: Math.round((fidelizados / metaColegio) * 100)
          }
        })
      )

      // Obtener coordinadores de recinto con sus metas
      const coordinadoresRecintos = await userRepository.find({
        where: { 
          role: UserRole.RECINTO,
          isActive: true
        },
        select: ['id', 'firstName', 'lastName'],
        take: 10 // Limitar para no sobrecargar
      })

      const metaRecinto = 15
      const metasRecintos = await Promise.all(
        coordinadoresRecintos.map(async (coord) => {
          const fidelizados = await fidelizacionRepo.count({
            where: { coordinadorId: coord.id }
          })
          return {
            coordinador: `${coord.firstName} ${coord.lastName}`,
            fidelizados,
            meta: metaRecinto,
            porcentaje: Math.round((fidelizados / metaRecinto) * 100)
          }
        })
      )

      res.json({
        totalMunicipales,
        totalColegios,
        totalRecintos,
        metasMunicipales,
        metasColegios,
        metasRecintos
      })
    } catch (error) {
      console.error('[UserController] Error al obtener estadísticas provinciales:', error)
      res.status(500).json({ message: 'Error al obtener estadísticas' })
    }
  }
}
