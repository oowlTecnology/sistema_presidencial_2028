import { Router } from 'express';
import { FuncionarioController } from '../controllers/funcionarioController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const funcionarioController = new FuncionarioController();

// Rutas para funcionarios - todas requieren autenticación
router.get('/', authenticateToken, funcionarioController.getAll.bind(funcionarioController));
router.get('/provincia/:provinciaId', authenticateToken, funcionarioController.getByProvincia.bind(funcionarioController));
router.get('/municipio/:municipioId', authenticateToken, funcionarioController.getByMunicipio.bind(funcionarioController));
router.get('/:id', authenticateToken, funcionarioController.getById.bind(funcionarioController));

// Rutas que requieren permisos especiales (solo super_admin y funcionarios)
router.post('/', authenticateToken, authorizeRoles('super_admin', 'funcionarios'), funcionarioController.create.bind(funcionarioController));
router.put('/:id', authenticateToken, authorizeRoles('super_admin', 'funcionarios'), funcionarioController.update.bind(funcionarioController));
router.delete('/:id', authenticateToken, authorizeRoles('super_admin', 'funcionarios'), funcionarioController.delete.bind(funcionarioController));

export default router;
