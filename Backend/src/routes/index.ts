import { Router } from 'express'
import authRoutes from './auth'
import userRoutes from './users'
import personaRoutes from './personas'
import adminRoutes from './admin'
import executiveRoutes from './executive'

const router = Router()

// Rutas principales
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/personas', personaRoutes)
router.use('/admin', adminRoutes)
router.use('/executive', executiveRoutes)
import provinciasRoutes from './provincias'
import municipiosRoutes from './municipios'
import circunscripcionesRoutes from './circunscripciones'
import colegiosRoutes from './colegios'
import recintosRoutes from './recintos'
import padronRoutes from './padron'
router.use('/provincias', provinciasRoutes)
router.use('/municipios', municipiosRoutes)
router.use('/circunscripciones', circunscripcionesRoutes)
router.use('/colegios', colegiosRoutes)
router.use('/recintos', recintosRoutes)
router.use('/padron', padronRoutes)

// Ruta de salud del servidor
router.get('/health', (req, res) => {
  res.json({
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

export default router
