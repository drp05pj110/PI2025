import { Router } from "express"
import ServiceOrderProductController from '../controllers/ServiceOrderProductController'

import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', ServiceOrderProductController.store)//Create
router.get('/', ServiceOrderProductController.index)//Show All
router.get('/:id', ServiceOrderProductController.show)//Show one
router.put('/:id', ServiceOrderProductController.update)//Edit
router.delete('/:id', ServiceOrderProductController.delete)//Delete

router.get('/order/:id', ServiceOrderProductController.getServiceOrderCategoryByOrderId)
router.get('/product/:id', ServiceOrderProductController.getServiceOrderCategoryByProductId)

export default router