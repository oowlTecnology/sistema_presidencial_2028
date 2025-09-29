import { Router } from 'express'
import { RecintoController } from '../controllers/recintoController'

const router = Router()
const recintoController = new RecintoController()

router.get('/', (req, res) => recintoController.getRecintosByColegio(req, res))

export default router
