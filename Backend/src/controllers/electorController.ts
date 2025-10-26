import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Elector, ElectorStatus, ElectorVoteStatus } from '../entities/Elector';
import { AuthRequest } from '../middleware/auth';
import { validate } from 'class-validator';

export class ElectorController {
  async getElectores(req: AuthRequest, res: Response) {
    try {
      const electorRepository = AppDataSource.getRepository(Elector);

      // Obtener electores con relaciones
      const electores = await electorRepository.find({
        relations: ['recinto', 'colegio', 'municipio', 'provincia'],
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
      const { firstName, lastName, cedula, estado, voto, recomendacionIA, recintoId, colegioId, municipioId, provinciaId } = req.body;
      const electorRepository = AppDataSource.getRepository(Elector);

      // Verificar si ya existe un elector con esa cédula
      const existingElector = await electorRepository.findOne({
        where: { cedula }
      });

      if (existingElector) {
        return res.status(400).json({ message: 'Ya existe un elector con esa cédula' });
      }

      // Crear nuevo elector
      const nuevoElector = electorRepository.create({
        firstName,
        lastName,
        cedula,
        estado: estado || ElectorStatus.PENDIENTE,
        voto: voto || ElectorVoteStatus.NO_HA_VOTADO,
        recomendacionIA,
        recintoId,
        colegioId,
        municipioId,
        provinciaId
      });

      // Validar
      const errors = await validate(nuevoElector);
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Datos de validación incorrectos', errors });
      }

      const electorGuardado = await electorRepository.save(nuevoElector);

      // Obtener el elector completo con relaciones
      const electorCompleto = await electorRepository.findOne({
        where: { id: electorGuardado.id },
        relations: ['recinto', 'colegio', 'municipio', 'provincia']
      });

      res.status(201).json(electorCompleto);
    } catch (error) {
      console.error('Error al crear elector:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async updateElector(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { firstName, lastName, cedula, estado, voto, recomendacionIA, recintoId, colegioId, municipioId, provinciaId } = req.body;
      const electorRepository = AppDataSource.getRepository(Elector);

      const elector = await electorRepository.findOne({
        where: { id }
      });

      if (!elector) {
        return res.status(404).json({ message: 'Elector no encontrado' });
      }

      // Actualizar campos
      elector.firstName = firstName || elector.firstName;
      elector.lastName = lastName || elector.lastName;
      elector.cedula = cedula || elector.cedula;
      elector.estado = estado || elector.estado;
      elector.voto = voto || elector.voto;
      elector.recomendacionIA = recomendacionIA || elector.recomendacionIA;
      elector.recintoId = recintoId !== undefined ? recintoId : elector.recintoId;
      elector.colegioId = colegioId !== undefined ? colegioId : elector.colegioId;
      elector.municipioId = municipioId !== undefined ? municipioId : elector.municipioId;
      elector.provinciaId = provinciaId !== undefined ? provinciaId : elector.provinciaId;

      // Validar
      const errors = await validate(elector);
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Datos de validación incorrectos', errors });
      }

      const electorActualizado = await electorRepository.save(elector);

      // Obtener el elector completo con relaciones
      const electorCompleto = await electorRepository.findOne({
        where: { id: electorActualizado.id },
        relations: ['recinto', 'colegio', 'municipio', 'provincia']
      });

      res.json(electorCompleto);
    } catch (error) {
      console.error('Error al actualizar elector:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async deleteElector(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const electorRepository = AppDataSource.getRepository(Elector);

      const elector = await electorRepository.findOne({
        where: { id }
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

      const electores = await electorRepository.find();
      
      const totalElectores = electores.length;
      const votaron = electores.filter(e => e.voto === ElectorVoteStatus.VOTO).length;
      const ratificados = electores.filter(e => e.estado === ElectorStatus.RATIFICADO).length;
      const pendientes = electores.filter(e => e.estado === ElectorStatus.PENDIENTE).length;
      const aConfirmar = electores.filter(e => e.estado === ElectorStatus.A_CONFIRMAR).length;

      const estadisticas = {
        totalElectores,
        votaron,
        noVotaron: totalElectores - votaron,
        ratificados,
        pendientes,
        aConfirmar,
        porcentajeVotacion: totalElectores > 0 ? ((votaron / totalElectores) * 100).toFixed(2) : 0,
        porcentajeRatificacion: totalElectores > 0 ? ((ratificados / totalElectores) * 100).toFixed(2) : 0
      };

      res.json(estadisticas);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

