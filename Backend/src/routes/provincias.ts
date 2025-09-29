import { Router } from 'express'
import { ProvinciaController } from '../controllers/provinciaController'

const router = Router()
const provinciaController = new ProvinciaController()

router.get('/', (req, res) => provinciaController.getProvincias(req, res))

export default router
