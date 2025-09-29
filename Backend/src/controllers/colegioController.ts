import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { Colegio } from '../entities/Colegio'
import { Municipio } from '../entities/Municipio'

export class ColegioController {
  async getColegiosByMunicipio(req: Request, res: Response) {
    try {
      const municipioId = parseInt(req.query.municipioId as string)
      console.log('[ColegioController] municipioId recibido:', req.query.municipioId)
      if (!municipioId) {
        return res.status(400).json({ message: 'municipioId es requerido' })
      }
      const colegioRepo = AppDataSource.getRepository(Colegio)
      let colegios = await colegioRepo.find({ where: { IDMunicipio: municipioId } })
      console.log('[ColegioController] colegios directos encontrados:', colegios.length)

      // Si no hay colegios directos, buscar en municipios hijos (DM) del municipio
      if (colegios.length === 0) {
        const municipioRepo = AppDataSource.getRepository(Municipio)
        const hijos = await municipioRepo.find({ where: { IDMunicipioPadre: municipioId } })
        console.log('[ColegioController] municipios hijos encontrados:', hijos.length)
        if (hijos.length > 0) {
          const hijosIds = hijos.map((m) => m.ID)
          colegios = await colegioRepo
            .createQueryBuilder('c')
            .where('c.IDMunicipio IN (:...ids)', { ids: hijosIds })
            .getMany()
          console.log('[ColegioController] colegios en municipios hijos:', colegios.length)
        }

        // Si aún no hay, buscar en el municipio padre (por si los colegios cuelgan del cabecera)
        if (colegios.length === 0) {
          const actual = await municipioRepo.findOne({ where: { ID: municipioId } })
          if (actual?.IDMunicipioPadre) {
            console.log('[ColegioController] buscando colegios en municipio padre:', actual.IDMunicipioPadre)
            colegios = await colegioRepo.find({ where: { IDMunicipio: actual.IDMunicipioPadre } })
            console.log('[ColegioController] colegios en municipio padre:', colegios.length)
          }
        }
      }

      res.json(colegios)
    } catch (error) {
      console.error('[ColegioController] Error:', error)
      res.status(500).json({ message: 'Error al obtener colegios' })
    }
  }
}
