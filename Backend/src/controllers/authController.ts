import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../config/database'
import { User, UserRole } from '../entities/User'
import { validate } from 'class-validator'

export class AuthController {
  async register(req: Request, res: Response) {
    console.log('Valor recibido de provinciaId:', req.body.provinciaId)
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
      } = req.body

      // Verificar si el usuario ya existe
      const userRepository = AppDataSource.getRepository(User)
      const existingUser = await userRepository.findOne({ where: { email } })

      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' })
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 12)

      // Crear nuevo usuario
      const user = userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || UserRole.RECINTO,
        phoneNumber,
        address,
        provinciaId: provinciaId ? Number(provinciaId) : undefined,
        isActive: true,
      })

      // Validar el usuario
      const errors = await validate(user)
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Datos de usuario inválidos',
          errors: errors.map((error) => Object.values(error.constraints || {})),
        })
      }

      await userRepository.save(user)

      // Crear token JWT con todos los IDs necesarios
      const jwtSecret =
        process.env.JWT_SECRET || 'default-secret-key-for-development'
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          provinciaId: user.provinciaId,
          municipioId: user.municipioId,
          colegioId: user.colegioId,
          recintoId: user.recintoId
        },
        jwtSecret,
        { expiresIn: '24h' }
      )

      // Remover la contraseña de la respuesta
      const { password: _, ...userWithoutPassword } = user

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: userWithoutPassword,
        token,
      })
    } catch (error) {
      console.error('Error en registro:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email y contraseña son requeridos' })
      }

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({
        where: { email },
        relations: ['provincia', 'municipio', 'colegio', 'recinto'],
      })

      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Credenciales inválidas' })
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales inválidas' })
      }

      // Crear token JWT con todos los IDs necesarios
      const jwtSecret =
        process.env.JWT_SECRET || 'default-secret-key-for-development'
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          provinciaId: user.provinciaId,
          municipioId: user.municipioId,
          colegioId: user.colegioId,
          recintoId: user.recintoId
        },
        jwtSecret,
        { expiresIn: '24h' }
      )

      // Remover la contraseña de la respuesta
      const { password: _, ...userWithoutPassword } = user

      res.json({
        message: 'Login exitoso',
        user: userWithoutPassword,
        token,
      })
    } catch (error) {
      console.error('Error en login:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  async getProfile(req: any, res: Response) {
    try {
      const user = req.user
      const { password: _, ...userWithoutPassword } = user
      res.json(userWithoutPassword)
    } catch (error) {
      console.error('Error al obtener perfil:', error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
}
