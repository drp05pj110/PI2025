import { Router } from "express"
import ServiceOrderController from '../controllers/ServiceOderController'

import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', ServiceOrderController.store)//Create
router.get('/', ServiceOrderController.index)//Show All
router.get('/:id', ServiceOrderController.show)//Show one
router.put('/:id', ServiceOrderController.update)//Edit
router.delete('/:id', ServiceOrderController.delete)//Delete

router.get('/customer/:id', ServiceOrderController.getServiceOrderByCustomer)
router.get('/address/:id', ServiceOrderController.getServiceOrderByAddress)

export default router