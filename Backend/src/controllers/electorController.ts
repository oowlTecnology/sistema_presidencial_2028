import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Elector, EstadoElector, EstadoVoto, RecomendacionIA } from '../entities/Elector';
import { AuthRequest } from '../middleware/auth';
import { validate } from 'class-validator';

export class ElectorController {
  async getElectores(req: AuthRequest, res: Response) {
    try {
      const electorRepository = AppDataSource.getRepository(Elector);
      const currentUser = req.user!;

      // Solo obtener electores del coordinador actual
      const electores = await electorRepository.find({
        where: { coordinadorId: currentUser.id },
        order: { createdAt: 'DESC' }
      });

      res.json(electores);
    } catch (error) {
      console.error('Error al obtener electores:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async createElector(req: AuthRequest, res: Response) {
    try {
      const { nombre, cedula, email, telefono, direccion, edad, estado, estadoVoto, recomendacionIA, notas, movilizador, transporte } = req.body;
      const currentUser = req.user!;
      const electorRepository = AppDataSource.getRepository(Elector);

      // Verificar si el elector ya existe
      const existingElector = await electorRepository.findOne({ where: { cedula } });
      if (existingElector) {
        return res.status(400).json({ message: 'El elector ya existe con esa cédula' });
      }

      const elector = electorRepository.create({
        nombre,
        cedula,
        email,
        telefono,
        direccion,
        edad,
        estado: estado || EstadoElector.A_CONFIRMAR,
        estadoVoto: estadoVoto || EstadoVoto.PENDIENTE,
        recomendacionIA: recomendacionIA || RecomendacionIA.SOLO_RECORDATORIO,
        notas,
        movilizador,
        transporte: transporte || false,
        coordinadorId: currentUser.id,
        isActive: true
      });

      const errors = await validate(elector);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Datos de elector inválidos',
          errors: errors.map(error => Object.values(error.constraints || {}))
        });
      }

      await electorRepository.save(elector);
      res.status(201).json({
        message: 'Elector registrado exitosamente',
        elector
      });
    } catch (error) {
      console.error('Error al crear elector:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async updateElector(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, cedula, email, telefono, direccion, edad, estado, estadoVoto, recomendacionIA, notas, movilizador, transporte } = req.body;
      const currentUser = req.user!;
      const electorRepository = AppDataSource.getRepository(Elector);

      const elector = await electorRepository.findOne({
        where: { id: parseInt(id), coordinadorId: currentUser.id }
      });

      if (!elector) {
        return res.status(404).json({ message: 'Elector no encontrado' });
      }

      elector.nombre = nombre || elector.nombre;
      elector.cedula = cedula || elector.cedula;
      elector.email = email || elector.email;
      elector.telefono = telefono || elector.telefono;
      elector.direccion = direccion || elector.direccion;
      elector.edad = edad || elector.edad;
      elector.estado = estado || elector.estado;
      elector.estadoVoto = estadoVoto || elector.estadoVoto;
      elector.recomendacionIA = recomendacionIA || elector.recomendacionIA;
      elector.notas = notas || elector.notas;
      elector.movilizador = movilizador || elector.movilizador;
      elector.transporte = transporte !== undefined ? transporte : elector.transporte;

      await electorRepository.save(elector);
      res.json({
        message: 'Elector actualizado exitosamente',
        elector
      });
    } catch (error) {
      console.error('Error al actualizar elector:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async deleteElector(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const currentUser = req.user!;
      const electorRepository = AppDataSource.getRepository(Elector);

      const elector = await electorRepository.findOne({
        where: { id: parseInt(id), coordinadorId: currentUser.id }
      });

      if (!elector) {
        return res.status(404).json({ message: 'Elector no encontrado' });
      }

      await electorRepository.remove(elector);
      res.json({ message: 'Elector eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar elector:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async getEstadisticas(req: AuthRequest, res: Response) {
    try {
      const electorRepository = AppDataSource.getRepository(Elector);
      const currentUser = req.user!;

      const electores = await electorRepository.find({
        where: { coordinadorId: currentUser.id, isActive: true }
      });

      const meta = 15; // Esto debería venir de configuración
      const captados = electores.length;
      const votaron = electores.filter(e => e.estadoVoto === EstadoVoto.VOTO).length;
      const cumplimiento = captados > 0 ? Math.round((votaron / captados) * 100) : 0;
      const faltan = Math.max(0, meta - captados);

      res.json({
        meta,
        captados,
        cumplimiento,
        faltan,
        votaron,
        totalElectores: electores.length
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}






