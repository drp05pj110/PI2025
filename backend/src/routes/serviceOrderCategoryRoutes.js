import { Router } from "express"
import ServiceOrderCategoryController from '../controllers/ServiceOrderCategoryController'

import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', ServiceOrderCategoryController.store)//Create
router.get('/', ServiceOrderCategoryController.index)//Show All
router.get('/:id', ServiceOrderCategoryController.show)//Show one
router.put('/:id', ServiceOrderCategoryController.update)//Edit
router.delete('/:id', ServiceOrderCategoryController.delete)//Delete

router.get('/order/:id', ServiceOrderCategoryController.getServiceOrderCategoryByOrderId)
router.get('/category/:id', ServiceOrderCategoryController.getServiceOrderCategoryByCategoryId)

export default router