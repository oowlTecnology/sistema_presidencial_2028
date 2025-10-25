import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Persona, EstadoPersona } from '../entities/Persona';
import { AuthRequest } from '../middleware/auth';
import { validate } from 'class-validator';

export class PersonaController {
  async getPersonas(req: AuthRequest, res: Response) {
    try {
      const personaRepository = AppDataSource.getRepository(Persona);
      const currentUser = req.user!;

      let whereCondition: any = {};

      // Aplicar filtros según el rol del usuario
      switch (currentUser.role) {
        case 'provincial':
          // El provincial puede ver todas las personas
          break;
        case 'municipal':
          // El municipal solo ve personas de su municipio
          whereCondition = { coordinador: { municipioId: currentUser.municipioId } };
          break;
        case 'colegio':
          // El de colegio solo ve personas de su colegio
          whereCondition = { coordinador: { colegioId: currentUser.colegioId } };
          break;
        case 'recinto':
          // El de recinto solo ve personas que él registró
          whereCondition = { coordinadorId: currentUser.id };
          break;
      }

      const personas = await personaRepository.find({
        where: whereCondition,
        relations: ['coordinador'],
        order: { createdAt: 'DESC' }
      });

      res.json(personas);
    } catch (error) {
      console.error('Error al obtener personas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async createPersona(req: AuthRequest, res: Response) {
    try {
      const { firstName, lastName, email, phoneNumber, address, cedula, age, estado, notas } = req.body;
      const currentUser = req.user!;
      const personaRepository = AppDataSource.getRepository(Persona);

      const persona = personaRepository.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        cedula,
        age,
        estado: estado || EstadoPersona.CONTACTADO,
        notas,
        coordinadorId: currentUser.id,
        isActive: true
      });

      const errors = await validate(persona);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Datos de persona inválidos',
          errors: errors.map(error => Object.values(error.constraints || {}))
        });
      }

      await personaRepository.save(persona);
      res.status(201).json({
        message: 'Persona registrada exitosamente',
        persona
      });
    } catch (error) {
      console.error('Error al crear persona:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async updatePersona(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, phoneNumber, address, cedula, age, estado, notas, isActive } = req.body;
      const currentUser = req.user!;
      const personaRepository = AppDataSource.getRepository(Persona);

      const persona = await personaRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['coordinador']
      });

      if (!persona) {
        return res.status(404).json({ message: 'Persona no encontrada' });
      }

      // Verificar permisos para actualizar
      if (currentUser.role !== 'provincial' && persona.coordinadorId !== currentUser.id) {
        return res.status(403).json({ message: 'No tienes permisos para actualizar esta persona' });
      }

      persona.firstName = firstName || persona.firstName;
      persona.lastName = lastName || persona.lastName;
      persona.email = email || persona.email;
      persona.phoneNumber = phoneNumber || persona.phoneNumber;
      persona.address = address || persona.address;
      persona.cedula = cedula || persona.cedula;
      persona.age = age || persona.age;
      persona.estado = estado || persona.estado;
      persona.notas = notas || persona.notas;
      persona.isActive = isActive !== undefined ? isActive : persona.isActive;

      await personaRepository.save(persona);
      res.json({
        message: 'Persona actualizada exitosamente',
        persona
      });
    } catch (error) {
      console.error('Error al actualizar persona:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async deletePersona(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const currentUser = req.user!;
      const personaRepository = AppDataSource.getRepository(Persona);

      const persona = await personaRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!persona) {
        return res.status(404).json({ message: 'Persona no encontrada' });
      }

      // Solo el provincial o el coordinador que la registró puede eliminar
      if (currentUser.role !== 'provincial' && persona.coordinadorId !== currentUser.id) {
        return res.status(403).json({ message: 'No tienes permisos para eliminar esta persona' });
      }

      await personaRepository.remove(persona);
      res.json({ message: 'Persona eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar persona:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}







