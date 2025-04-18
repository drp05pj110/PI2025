import { Router } from "express"
import ServiceOrderContactController from '../controllers/ServiceOrderContactController'

import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', ServiceOrderContactController.store)//Create
router.get('/', ServiceOrderContactController.index)//Show All
router.get('/:id', ServiceOrderContactController.show)//Show one
router.put('/:id', ServiceOrderContactController.update)//Edit
router.delete('/:id', ServiceOrderContactController.delete)//Delete

router.get('/order/:id', ServiceOrderContactController.getServiceOrderCategoryByOrderId)
router.get('/contact/:id', ServiceOrderContactController.getServiceOrderCategoryByContactId)

export default router