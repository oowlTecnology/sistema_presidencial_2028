import { Router } from 'express'
import authRoutes from './auth'
import userRoutes from './users'
import personaRoutes from './personas'

const router = Router()

// Rutas principales
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/personas', personaRoutes)
import provinciasRoutes from './provincias'
import municipiosRoutes from './municipios'
router.use('/provincias', provinciasRoutes)
router.use('/municipios', municipiosRoutes)

// Ruta de salud del servidor
router.get('/health', (req, res) => {
  res.json({
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

export default router
