import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { Municipio } from '../entities/Municipio'

export class MunicipioController {
  async getMunicipiosByProvincia(req: Request, res: Response) {
    try {
      const provinciaId = parseInt(req.query.provinciaId as string)
      if (!provinciaId) {
        return res.status(400).json({ message: 'provinciaId es requerido' })
      }
      const municipioRepository = AppDataSource.getRepository(Municipio)
      const municipios = await municipioRepository.find({
        where: { IDProvincia: provinciaId },
      })
      res.json(municipios)
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener municipios' })
    }
  }
}
