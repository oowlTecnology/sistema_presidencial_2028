import { Router } from 'express'
import { ExecutiveController } from '../controllers/executiveController'
import { authenticateToken } from '../middleware/auth'

const router = Router()
const executiveController = new ExecutiveController()

// Proteger con autenticación
router.use(authenticateToken)

// Estadísticas ejecutivas
router.get('/estadisticas', (req, res) => executiveController.getEstadisticasEjecutivas(req, res))

export default router
