import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { Recinto } from '../entities/Recinto'
import { Colegio } from '../entities/Colegio'

export class RecintoController {
  async getRecintosByColegio(req: Request, res: Response) {
    try {
      const colegioId = parseInt(req.query.colegioId as string)
      console.log('[RecintoController] colegioId recibido:', req.query.colegioId)
      if (!colegioId) {
        return res.status(400).json({ message: 'colegioId es requerido' })
      }

      const colegioRepo = AppDataSource.getRepository(Colegio)
      const recintoRepo = AppDataSource.getRepository(Recinto)

      const colegio = await colegioRepo.findOne({ where: { IDColegio: colegioId } })
      if (!colegio) return res.status(404).json({ message: 'Colegio no encontrado' })

      // Según el esquema, Colegio.IDRecinto referencia Recinto.ID
      const recintos = await recintoRepo.find({ where: { ID: colegio.IDRecinto } })
      console.log('[RecintoController] recintos encontrados:', recintos.length)
      res.json(recintos)
    } catch (error) {
      console.error('[RecintoController] Error:', error)
      res.status(500).json({ message: 'Error al obtener recintos' })
    }
  }
}
