import { Router } from 'express'
import { AdminController } from '../controllers/adminController'
import { authenticateToken } from '../middleware/auth'
import { requireSuperAdmin } from '../middleware/adminAuth'

const router = Router()
const adminController = new AdminController()

// Todas las rutas requieren autenticación Y ser Super Admin
router.use(authenticateToken)
router.use(requireSuperAdmin)

// Gestión de usuarios
router.get('/users', (req, res) => adminController.getAllUsers(req, res))
router.post('/users/change-password', (req, res) => adminController.changeUserPassword(req, res))
router.post('/users/change-role', (req, res) => adminController.changeUserRole(req, res))
router.patch('/users/:userId/status', (req, res) => adminController.toggleUserStatus(req, res))
router.delete('/users/:userId', (req, res) => adminController.deleteUser(req, res))

export default router
