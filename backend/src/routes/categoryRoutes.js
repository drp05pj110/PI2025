import { Router } from "express"
import CategoryController from "../controllers/CategoryController"

import loginRequired from '../middlewares/loginRequired'


const router = new Router()

router.post('/', CategoryController.store)//Create
router.get('/', CategoryController.index)//Show All
router.get('/:id', CategoryController.show)//Show one
router.put('/:id', CategoryController.update)//Edit
router.delete('/:id', CategoryController.delete)//Delete

export default router