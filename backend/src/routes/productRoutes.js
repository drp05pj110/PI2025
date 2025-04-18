import { Router } from "express"
import ProductController from "../controllers/ProductController"

import loginRequired from '../middlewares/loginRequired'


const router = new Router()

router.post('/', ProductController.store)//Create
router.get('/', ProductController.index)//Show All
router.get('/:id', ProductController.show)//Show one
router.put('/:id', ProductController.update)//Edit
router.delete('/:id', ProductController.delete)//Delete

router.get('/category/:id', ProductController.getProductByCategory)

export default router