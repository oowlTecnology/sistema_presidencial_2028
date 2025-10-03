import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para gestión de usuarios
router.get('/', userController.getUsers);
router.get('/estadisticas-provincial', userController.getEstadisticasProvincial);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', authorizeRoles('provincial'), userController.deleteUser);

export default router;
