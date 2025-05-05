import { Router } from "express"
import BudgetController from '../controllers/BudgetController'

import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', BudgetController.store)//Create
router.get('/', BudgetController.index)//Show All
router.get('/:id', BudgetController.show)//Show one
router.put('/:id', BudgetController.update)//Edit
router.delete('/:id', BudgetController.delete)//Delete

export default router