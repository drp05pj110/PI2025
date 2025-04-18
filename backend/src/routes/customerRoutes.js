import { Router } from "express"
import CustomerController from '../controllers/CustomerController'

import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', CustomerController.store)//Create
router.get('/', CustomerController.index)//Show All
router.get('/:id', CustomerController.show)//Show one
router.put('/:id', CustomerController.update)//Edit
router.delete('/:id', CustomerController.delete)//Delete

export default router