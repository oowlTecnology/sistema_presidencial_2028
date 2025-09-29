import { Router } from 'express'
import { ColegioController } from '../controllers/colegioController'

const router = Router()
const colegioController = new ColegioController()

router.get('/', (req, res) => colegioController.getColegiosByMunicipio(req, res))

export default router
