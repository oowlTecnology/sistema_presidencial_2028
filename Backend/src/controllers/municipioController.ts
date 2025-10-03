import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { Municipio } from '../entities/Municipio'

export class MunicipioController {
  async getMunicipiosByProvincia(req: Request, res: Response) {
    try {
      const provinciaId = parseInt(req.query.provinciaId as string)
      
      if (!provinciaId || isNaN(provinciaId)) {
        return res.status(400).json({ message: 'provinciaId es requerido y debe ser un número' })
      }
      
      const municipioRepository = AppDataSource.getRepository(Municipio)
      
      // Obtener todos los municipios de la provincia
      const todosMunicipios = await municipioRepository.find({
        where: { IDProvincia: provinciaId },
        order: { Descripcion: 'ASC' }
      })
      
      // Filtrar solo municipios cabecera (excluir distritos municipales)
      // Un municipio es cabecera si:
      // - IDMunicipioPadre es null
      // - IDMunicipioPadre es 0
      // - IDMunicipioPadre es igual a su propio ID (auto-referencia)
      const municipiosCabecera = todosMunicipios.filter(m => 
        m.IDMunicipioPadre === null || 
        m.IDMunicipioPadre === 0 || 
        m.IDMunicipioPadre === m.ID
      )
      
      res.json(municipiosCabecera)
    } catch (error) {
      console.error('[MunicipioController] Error al obtener municipios:', error)
      res.status(500).json({ message: 'Error al obtener municipios' })
    }
  }
}
