import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { User, UserRole } from '../entities/User'
import { Provincia } from '../entities/Provincia'
import { Municipio } from '../entities/Municipio'
import { Fidelizacion } from '../entities/Fidelizacion'
import { Padron } from '../entities/Padron'
import { AuthRequest } from '../middleware/auth'
import { Between } from 'typeorm'

export class ExecutiveController {
  async getEstadisticasEjecutivas(req: AuthRequest, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User)
      const provinciaRepository = AppDataSource.getRepository(Provincia)
      const fidelizacionRepository = AppDataSource.getRepository(Fidelizacion)
      const padronRepository = AppDataSource.getRepository(Padron)

      // Contar coordinadores por tipo
      const totalSuperAdmins = await userRepository.count({ where: { role: UserRole.SUPER_ADMIN, isActive: true } })
      const totalEjecutivos = await userRepository.count({ where: { role: UserRole.EJECUTIVO, isActive: true } })
      const totalProvinciales = await userRepository.count({ where: { role: UserRole.PROVINCIAL, isActive: true } })
      const totalMunicipales = await userRepository.count({ where: { role: UserRole.MUNICIPAL, isActive: true } })
      const totalCircunscripciones = await userRepository.count({ where: { role: UserRole.CIRCUNSCRIPCION, isActive: true } })
      const totalColegios = await userRepository.count({ where: { role: UserRole.COLEGIO, isActive: true } })
      const totalRecintos = await userRepository.count({ where: { role: UserRole.RECINTO, isActive: true } })

      // Total de usuarios activos
      const totalUsuariosActivos = await userRepository.count({ where: { isActive: true } })
      const totalUsuariosInactivos = await userRepository.count({ where: { isActive: false } })

      // Total de fidelizaciones
      const totalFidelizaciones = await fidelizacionRepository.count()

      // Total de personas en el padrón
      const totalPadron = await padronRepository.count()

      // Porcentaje de fidelización
      const porcentajeFidelizacion = totalPadron > 0 ? (totalFidelizaciones / totalPadron) * 100 : 0

      // Obtener solo las provincias de República Dominicana (ID 1 a 32)
      const provincias = await provinciaRepository.find({
        where: {
          ID: Between(1, 32)
        },
        order: {
          Descripcion: 'ASC'
        }
      })

      // Estadísticas por provincia
      const estadisticasPorProvincia = await Promise.all(
        provincias.map(async (provincia) => {
          const coordinadoresProvinciales = await userRepository.count({
            where: { provinciaId: provincia.ID, role: UserRole.PROVINCIAL, isActive: true }
          })

          const coordinadoresMunicipales = await userRepository.count({
            where: { provinciaId: provincia.ID, role: UserRole.MUNICIPAL, isActive: true }
          })

          const coordinadoresCircunscripcion = await userRepository.count({
            where: { provinciaId: provincia.ID, role: UserRole.CIRCUNSCRIPCION, isActive: true }
          })

          // Contar fidelizaciones por provincia (a través de coordinadores)
          const coordinadoresProvincia = await userRepository.find({
            where: { provinciaId: provincia.ID, isActive: true },
            select: ['id']
          })

          const coordinadorIds = coordinadoresProvincia.map(c => c.id)
          let fidelizacionesProvincia = 0
          
          if (coordinadorIds.length > 0) {
            fidelizacionesProvincia = await fidelizacionRepository
              .createQueryBuilder('f')
              .where('f.coordinadorId IN (:...ids)', { ids: coordinadorIds })
              .getCount()
          }

          return {
            provincia: provincia.Descripcion,
            provinciaId: provincia.ID,
            coordinadoresProvinciales,
            coordinadoresMunicipales,
            coordinadoresCircunscripcion,
            totalCoordinadores: coordinadoresProvinciales + coordinadoresMunicipales + coordinadoresCircunscripcion,
            fidelizaciones: fidelizacionesProvincia,
            cobertura: coordinadoresMunicipales > 0 ? 'alta' : coordinadoresProvinciales > 0 ? 'media' : 'baja'
          }
        })
      )

      // Top 10 coordinadores con más fidelizaciones
      const topCoordinadores = await fidelizacionRepository
        .createQueryBuilder('f')
        .select('f.coordinadorId', 'coordinadorId')
        .addSelect('COUNT(*)', 'total')
        .groupBy('f.coordinadorId')
        .orderBy('COUNT(*)', 'DESC')
        .limit(10)
        .getRawMany()

      const topCoordinadoresConNombres = await Promise.all(
        topCoordinadores.map(async (item) => {
          const coordinador = await userRepository.findOne({
            where: { id: item.coordinadorId },
            select: ['id', 'firstName', 'lastName', 'role']
          })
          return {
            nombre: coordinador ? `${coordinador.firstName} ${coordinador.lastName}` : 'Desconocido',
            rol: coordinador?.role || 'N/A',
            fidelizaciones: parseInt(item.total)
          }
        })
      )

      // Tendencias (últimos 7 días)
      const hace7Dias = new Date()
      hace7Dias.setDate(hace7Dias.getDate() - 7)

      const fidelizacionesRecientes = await fidelizacionRepository
        .createQueryBuilder('f')
        .where('f.fechaFidelizacion >= :fecha', { fecha: hace7Dias })
        .getCount()

      const usuariosNuevos = await userRepository
        .createQueryBuilder('u')
        .where('u.createdAt >= :fecha', { fecha: hace7Dias })
        .getCount()

      res.json({
        resumen: {
          totalSuperAdmins,
          totalEjecutivos,
          totalProvinciales,
          totalMunicipales,
          totalCircunscripciones,
          totalColegios,
          totalRecintos,
          totalUsuariosActivos,
          totalUsuariosInactivos,
          totalFidelizaciones,
          totalPadron,
          porcentajeFidelizacion: Math.round(porcentajeFidelizacion * 100) / 100
        },
        estadisticasPorProvincia,
        topCoordinadores: topCoordinadoresConNombres,
        tendencias: {
          fidelizacionesUltimos7Dias: fidelizacionesRecientes,
          usuariosNuevosUltimos7Dias: usuariosNuevos
        },
        sugerencias: this.generarSugerencias(estadisticasPorProvincia, totalFidelizaciones, totalPadron)
      })
    } catch (error) {
      console.error('[ExecutiveController] Error al obtener estadísticas:', error)
      res.status(500).json({ message: 'Error al obtener estadísticas ejecutivas' })
    }
  }

  private generarSugerencias(estadisticasProvincia: any[], totalFidelizaciones: number, totalPadron: number): any[] {
    const sugerencias = []

    // Sugerencia 1: Provincias sin cobertura
    const provinciasSinCobertura = estadisticasProvincia.filter(p => p.cobertura === 'baja')
    if (provinciasSinCobertura.length > 0) {
      sugerencias.push({
        tipo: 'critico',
        icono: 'warning',
        titulo: 'Provincias sin cobertura adecuada',
        descripcion: `${provinciasSinCobertura.length} provincias necesitan más coordinadores`,
        provincias: provinciasSinCobertura.map(p => p.provincia).join(', ')
      })
    }

    // Sugerencia 2: Porcentaje de fidelización bajo
    const porcentaje = (totalFidelizaciones / totalPadron) * 100
    if (porcentaje < 30) {
      sugerencias.push({
        tipo: 'importante',
        icono: 'trending_down',
        titulo: 'Porcentaje de fidelización bajo',
        descripcion: `Solo el ${porcentaje.toFixed(1)}% del padrón está fidelizado. Considera aumentar las metas.`,
        accion: 'Revisar estrategias de fidelización'
      })
    }

    // Sugerencia 3: Provincias con mejor desempeño
    const mejoresProvincias = estadisticasProvincia
      .sort((a, b) => b.fidelizaciones - a.fidelizaciones)
      .slice(0, 3)
    
    if (mejoresProvincias.length > 0) {
      sugerencias.push({
        tipo: 'exito',
        icono: 'emoji_events',
        titulo: 'Provincias destacadas',
        descripcion: `${mejoresProvincias[0].provincia} lidera con ${mejoresProvincias[0].fidelizaciones} fidelizaciones`,
        provincias: mejoresProvincias.map(p => p.provincia).join(', ')
      })
    }

    // Sugerencia 4: Necesidad de más coordinadores
    const totalCoordinadores = estadisticasProvincia.reduce((sum, p) => sum + p.totalCoordinadores, 0)
    const numProvincias = estadisticasProvincia.length
    if (totalCoordinadores < numProvincias * 2) {
      sugerencias.push({
        tipo: 'info',
        icono: 'person_add',
        titulo: 'Ampliar equipo de coordinadores',
        descripcion: 'Considera agregar más coordinadores para mejorar la cobertura territorial',
        accion: 'Reclutar coordinadores en provincias clave'
      })
    }

    return sugerencias
  }
}
