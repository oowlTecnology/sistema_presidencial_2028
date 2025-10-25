import { Router } from 'express';
import { PersonaController } from '../controllers/personaController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const personaController = new PersonaController();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para gestión de personas
router.get('/', personaController.getPersonas);
router.post('/', personaController.createPersona);
router.put('/:id', personaController.updatePersona);
router.delete('/:id', personaController.deletePersona);

export default router;







