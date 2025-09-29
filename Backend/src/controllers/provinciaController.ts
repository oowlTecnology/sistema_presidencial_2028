import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { Provincia } from '../entities/Provincia'

export class ProvinciaController {
  async getProvincias(req: Request, res: Response) {
    try {
      const provinciaRepository = AppDataSource.getRepository(Provincia)
      const provincias = await provinciaRepository.find()
      res.json(provincias)
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener provincias' })
    }
  }
}
