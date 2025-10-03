import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { Circunscripcion } from '../entities/Circunscripcion'

export class CircunscripcionController {
  async getCircunscripcionesByProvincia(req: Request, res: Response) {
    try {
      const provinciaId = parseInt(req.query.provinciaId as string)
      if (!provinciaId) {
        return res.status(400).json({ message: 'provinciaId es requerido' })
      }
      const circunscripcionRepository = AppDataSource.getRepository(Circunscripcion)
      
      const circunscripciones = await circunscripcionRepository.find({
        where: { IDProvincia: provinciaId },
        order: { Descripcion: 'ASC' }
      })
      
      res.json(circunscripciones)
    } catch (error) {
      console.error('Error al obtener circunscripciones:', error)
      res.status(500).json({ message: 'Error al obtener circunscripciones' })
    }
  }
}
