import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { Padron } from '../entities/Padron'
// import { Foto } from '../entities/Foto'
import { Fidelizacion } from '../entities/Fidelizacion'
import { Colegio } from '../entities/Colegio'

export class PadronController {
  // Buscar persona por cédula
  async buscarPorCedula(req: Request, res: Response) {
    try {
      const { cedula } = req.params
      const userId = (req as any).user?.id

      if (!cedula) {
        return res.status(400).json({ message: 'Cédula es requerida' })
      }

      const padronRepo = AppDataSource.getRepository(Padron)
      // const fotoRepo = AppDataSource.getRepository(Foto)
      const fidelizacionRepo = AppDataSource.getRepository(Fidelizacion)
      const colegioRepo = AppDataSource.getRepository(Colegio)

      // Buscar persona en el padrón
      const persona = await padronRepo.findOne({ where: { cedula } })

      if (!persona) {
        return res.status(404).json({ message: 'Cédula no encontrada en el padrón' })
      }

      // Buscar foto
      // const foto = await fotoRepo.findOne({ where: { Cedula: cedula } })

      // Buscar colegio electoral
      let colegioElectoral = null
      if (persona.idcolegio) {
        colegioElectoral = await colegioRepo.findOne({
          where: { IDColegio: persona.idcolegio }
        })
      }

      // Verificar si ya fue fidelizado
      const fidelizacion = await fidelizacionRepo.findOne({
        where: { cedula },
        relations: ['coordinador']
      })

      const nombreCompleto = `${persona.nombres || ''} ${persona.apellido1 || ''} ${persona.apellido2 || ''}`.trim()

      res.json({
        cedula: persona.cedula,
        nombreCompleto,
        nombres: persona.nombres,
        apellido1: persona.apellido1,
        apellido2: persona.apellido2,
        colegioElectoral: colegioElectoral ? {
          codigo: colegioElectoral.CodigoColegio,
          descripcion: colegioElectoral.Descripcion
        } : null,
        // foto: foto?.Imagen ? `data:image/jpeg;base64,${foto.Imagen.toString('base64')}` : null,
        foto: null,
        fidelizado: !!fidelizacion,
        fidelizadoPor: fidelizacion ? {
          coordinador: `${fidelizacion.coordinador.firstName} ${fidelizacion.coordinador.lastName}`,
          fecha: fidelizacion.fechaFidelizacion
        } : null
      })
    } catch (error) {
      console.error('[PadronController] Error al buscar por cédula:', error)
      res.status(500).json({ message: 'Error al buscar persona' })
    }
  }

  // Obtener personas del colegio con paginación
  async getPersonasPorColegio(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id
      const { colegioId, page = '1', limit = '10' } = req.query

      if (!colegioId) {
        return res.status(400).json({ message: 'colegioId es requerido' })
      }

      const pageNumber = parseInt(page as string)
      const limitNumber = parseInt(limit as string)
      const skip = (pageNumber - 1) * limitNumber

      const padronRepo = AppDataSource.getRepository(Padron)
      // const fotoRepo = AppDataSource.getRepository(Foto)
      const fidelizacionRepo = AppDataSource.getRepository(Fidelizacion)

      // Obtener total de personas y personas paginadas
      const [personas, total] = await padronRepo.findAndCount({
        where: { idcolegio: parseInt(colegioId as string) },
        skip: skip,
        take: limitNumber,
        order: { cedula: 'ASC' }
      })

      // Obtener todas las fidelizaciones del colegio (no paginadas)
      const fidelizaciones = await fidelizacionRepo.find({
        where: { colegioId: parseInt(colegioId as string) },
        relations: ['coordinador']
      })

      const fidelizacionMap = new Map(
        fidelizaciones.map(f => [f.cedula, f])
      )

      // Construir respuesta SIN fotos (comentado para optimizar)
      const resultado = personas.map((persona) => {
        // const foto = await fotoRepo.findOne({ where: { Cedula: persona.cedula } })
        const fidelizacion = fidelizacionMap.get(persona.cedula)

        return {
          cedula: persona.cedula,
          nombreCompleto: `${persona.nombres || ''} ${persona.apellido1 || ''} ${persona.apellido2 || ''}`.trim(),
          // foto: foto?.Imagen ? `data:image/jpeg;base64,${foto.Imagen.toString('base64')}` : null,
          foto: null,
          fidelizado: !!fidelizacion,
          fidelizadoPor: fidelizacion ? {
            coordinador: `${fidelizacion.coordinador.firstName} ${fidelizacion.coordinador.lastName}`,
            fecha: fidelizacion.fechaFidelizacion
          } : null
        }
      })

      res.json({
        data: resultado,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total: total,
          totalPages: Math.ceil(total / limitNumber)
        }
      })
    } catch (error) {
      console.error('[PadronController] Error al obtener personas del colegio:', error)
      res.status(500).json({ message: 'Error al obtener personas' })
    }
  }

  // Obtener estadísticas del colegio
  async getEstadisticasColegio(req: Request, res: Response) {
    try {
      const { colegioId } = req.query
      const userId = (req as any).user?.id

      if (!colegioId) {
        return res.status(400).json({ message: 'colegioId es requerido' })
      }

      const padronRepo = AppDataSource.getRepository(Padron)
      const fidelizacionRepo = AppDataSource.getRepository(Fidelizacion)

      // Total de personas en el colegio
      const totalPersonas = await padronRepo.count({
        where: { idcolegio: parseInt(colegioId as string) }
      })

      // Contar masculinos (idsexo = 'M')
      const totalMasculinos = await padronRepo.count({
        where: { 
          idcolegio: parseInt(colegioId as string),
          idsexo: 'M'
        }
      })

      // Contar femeninos (idsexo = 'F')
      const totalFemeninos = await padronRepo.count({
        where: { 
          idcolegio: parseInt(colegioId as string),
          idsexo: 'F'
        }
      })

      // Contar fidelizados por este coordinador
      const totalFidelizados = await fidelizacionRepo.count({
        where: { 
          coordinadorId: userId,
          colegioId: parseInt(colegioId as string)
        }
      })

      const metaFidelizacion = 15

      res.json({
        totalPersonas,
        totalMasculinos,
        totalFemeninos,
        totalFidelizados,
        metaFidelizacion,
        porcentajeMeta: Math.round((totalFidelizados / metaFidelizacion) * 100)
      })
    } catch (error) {
      console.error('[PadronController] Error al obtener estadísticas:', error)
      res.status(500).json({ message: 'Error al obtener estadísticas' })
    }
  }

  // Fidelizar persona
  async fidelizar(req: Request, res: Response) {
    try {
      const { cedula } = req.body
      const userId = (req as any).user?.id
      const userColegioId = (req as any).user?.colegioId

      if (!cedula) {
        return res.status(400).json({ message: 'Cédula es requerida' })
      }

      const padronRepo = AppDataSource.getRepository(Padron)
      const fidelizacionRepo = AppDataSource.getRepository(Fidelizacion)

      // Verificar que la persona existe
      const persona = await padronRepo.findOne({ where: { cedula } })
      if (!persona) {
        return res.status(404).json({ message: 'Persona no encontrada en el padrón' })
      }

      // Verificar si ya fue fidelizado
      const fidelizacionExistente = await fidelizacionRepo.findOne({
        where: { cedula },
        relations: ['coordinador']
      })

      if (fidelizacionExistente) {
        return res.status(400).json({
          message: `Esta persona ya fue fidelizada por ${fidelizacionExistente.coordinador.firstName} ${fidelizacionExistente.coordinador.lastName}`,
          fidelizadoPor: {
            coordinador: `${fidelizacionExistente.coordinador.firstName} ${fidelizacionExistente.coordinador.lastName}`,
            fecha: fidelizacionExistente.fechaFidelizacion
          }
        })
      }

      // Crear fidelización
      const nuevaFidelizacion = fidelizacionRepo.create({
        cedula,
        coordinadorId: userId,
        colegioId: userColegioId
      })

      await fidelizacionRepo.save(nuevaFidelizacion)

      res.json({
        message: 'Persona fidelizada exitosamente',
        fidelizacion: nuevaFidelizacion
      })
    } catch (error) {
      console.error('[PadronController] Error al fidelizar:', error)
      res.status(500).json({ message: 'Error al fidelizar persona' })
    }
  }
}
