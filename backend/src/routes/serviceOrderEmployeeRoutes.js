import { Router } from "express"
import ServiceOrderEmployeeController from '../controllers/ServiceOrderEmployeeController'

import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', ServiceOrderEmployeeController.store)//Create
router.get('/', ServiceOrderEmployeeController.index)//Show All
router.get('/:id', ServiceOrderEmployeeController.show)//Show one
router.put('/:id', ServiceOrderEmployeeController.update)//Edit
router.delete('/:id', ServiceOrderEmployeeController.delete)//Delete

router.get('/order/:id', ServiceOrderEmployeeController.getServiceOrderCategoryByOrderId)
router.get('/employee/:id', ServiceOrderEmployeeController.getServiceOrderCategoryByEmployeeId)

export default router