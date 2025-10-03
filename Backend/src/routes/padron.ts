import { Router } from 'express'
import { PadronController } from '../controllers/padronController'
import { authenticateToken } from '../middleware/auth'

const router = Router()
const padronController = new PadronController()

// Todas las rutas requieren autenticación
router.get('/buscar/:cedula', authenticateToken, (req, res) => padronController.buscarPorCedula(req, res))
router.get('/colegio', authenticateToken, (req, res) => padronController.getPersonasPorColegio(req, res))
router.get('/estadisticas', authenticateToken, (req, res) => padronController.getEstadisticasColegio(req, res))
router.post('/fidelizar', authenticateToken, (req, res) => padronController.fidelizar(req, res))

export default router
