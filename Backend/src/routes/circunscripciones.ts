import { Router } from 'express'
import { CircunscripcionController } from '../controllers/circunscripcionController'

const router = Router()
const circunscripcionController = new CircunscripcionController()

router.get('/', (req, res) =>
  circunscripcionController.getCircunscripcionesByProvincia(req, res)
)

export default router
