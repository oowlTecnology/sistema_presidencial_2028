import { Router } from 'express'
import { MunicipioController } from '../controllers/municipioController'

const router = Router()
const municipioController = new MunicipioController()

router.get('/', (req, res) =>
  municipioController.getMunicipiosByProvincia(req, res)
)

export default router
