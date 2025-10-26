import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import { AuthRequest } from '../middleware/auth';
import { validate } from 'class-validator';
import bcrypt from 'bcryptjs';

export class UserController {
  async getUsers(req: AuthRequest, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const currentUser = req.user!;

      let whereCondition: any = {};
      let relations = ['provincia', 'municipio', 'colegio', 'recinto'];

      // Aplicar filtros según el rol del usuario
      switch (currentUser.role) {
        case UserRole.PROVINCIAL:
          // El provincial puede ver todos los usuarios
          break;
        case UserRole.MUNICIPAL:
          // El municipal solo ve usuarios de su municipio
          whereCondition = { municipioId: currentUser.municipioId };
          break;
        case UserRole.COLEGIO:
          // El de colegio solo ve usuarios de su colegio
          whereCondition = { colegioId: currentUser.colegioId };
          break;
        case UserRole.RECINTO:
          // El de recinto solo ve usuarios de su recinto
          whereCondition = { recintoId: currentUser.recintoId };
          break;
      }

      const users = await userRepository.find({
        where: whereCondition,
        relations,
        select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'phoneNumber', 'address', 'createdAt']
      });

      res.json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async createUser(req: AuthRequest, res: Response) {
    try {
      const { email, password, firstName, lastName, role, phoneNumber, address, provinciaId, municipioId, colegioId, recintoId } = req.body;
      const currentUser = req.user!;
      const userRepository = AppDataSource.getRepository(User);

      // Verificar si el usuario ya existe
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Validar permisos para crear usuario según rol
      const newUserRole = role as UserRole;
      let validatedIds: any = {};

      switch (currentUser.role) {
        case UserRole.PROVINCIAL:
          // El provincial puede crear usuarios de cualquier nivel
          validatedIds = { provinciaId, municipioId, colegioId, recintoId };
          break;
        case UserRole.MUNICIPAL:
          // El municipal puede crear usuarios de colegio y recinto en su municipio
          if (newUserRole === UserRole.COLEGIO || newUserRole === UserRole.RECINTO) {
            validatedIds = { municipioId: currentUser.municipioId, colegioId, recintoId };
          } else {
            return res.status(403).json({ message: 'No tienes permisos para crear este tipo de usuario' });
          }
          break;
        case UserRole.COLEGIO:
          // El de colegio puede crear usuarios de recinto en su colegio
          if (newUserRole === UserRole.RECINTO) {
            validatedIds = { colegioId: currentUser.colegioId, recintoId };
          } else {
            return res.status(403).json({ message: 'No tienes permisos para crear este tipo de usuario' });
          }
          break;
        default:
          return res.status(403).json({ message: 'No tienes permisos para crear usuarios' });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: newUserRole,
        phoneNumber,
        address,
        isActive: true,
        ...validatedIds
      });

      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Datos de usuario inválidos',
          errors: errors.map(error => Object.values(error.constraints || {}))
        });
      }

      const savedUser = await userRepository.save(user);
      const { password: _, ...userWithoutPassword } = Array.isArray(savedUser) ? savedUser[0] : savedUser;

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { firstName, lastName, phoneNumber, address, isActive } = req.body;
      const currentUser = req.user!;
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({ where: { id: parseInt(id) } });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verificar permisos para actualizar
      if (currentUser.id !== parseInt(id) && currentUser.role !== UserRole.PROVINCIAL) {
        // Verificar si el usuario pertenece a la jerarquía del usuario actual
        let hasPermission = false;
        
        switch (currentUser.role) {
          case UserRole.MUNICIPAL:
            hasPermission = user.municipioId === currentUser.municipioId;
            break;
          case UserRole.COLEGIO:
            hasPermission = user.colegioId === currentUser.colegioId;
            break;
          case UserRole.RECINTO:
            hasPermission = user.recintoId === currentUser.recintoId;
            break;
        }

        if (!hasPermission) {
          return res.status(403).json({ message: 'No tienes permisos para actualizar este usuario' });
        }
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.address = address || user.address;
      user.isActive = isActive !== undefined ? isActive : user.isActive;

      const updatedUser = await userRepository.save(user);
      const { password: _, ...userWithoutPassword } = Array.isArray(updatedUser) ? updatedUser[0] : updatedUser;

      res.json({
        message: 'Usuario actualizado exitosamente',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const currentUser = req.user!;
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({ where: { id: parseInt(id) } });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Solo el provincial puede eliminar usuarios
      if (currentUser.role !== UserRole.PROVINCIAL) {
        return res.status(403).json({ message: 'No tienes permisos para eliminar usuarios' });
      }

      // No permitir eliminar al propio usuario
      if (currentUser.id === parseInt(id)) {
        return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
      }

      await userRepository.remove(user);
      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
