import { Router } from "express"
import ContactController from "../controllers/ContactController"

import loginRequired from '../middlewares/loginRequired'


const router = new Router()

router.post('/', ContactController.store)//Create
router.get('/', ContactController.index)//Show All
router.get('/:id', ContactController.show)//Show one
router.put('/:id', ContactController.update)//Edit
router.delete('/:id', ContactController.delete)//Delete

router.get('/customer/:id', ContactController.getContactByCustomer)

export default router