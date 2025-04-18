import { Router } from "express"
import EmployeeController from '../controllers/EmployeeController'

import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', EmployeeController.store)//Create
router.get('/', EmployeeController.index)//Show All
router.get('/:id', EmployeeController.show)//Show one
router.put('/:id', EmployeeController.update)//Edit
router.delete('/:id', EmployeeController.delete)//Delete

export default router