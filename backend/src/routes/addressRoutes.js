import { Router } from "express"
import AddressController from "../controllers/AddressController"

import loginRequired from '../middlewares/loginRequired'


const router = new Router()

router.post('/', AddressController.store)//Create
router.get('/', AddressController.index)//Show All
router.get('/:id', AddressController.show)//Show one
router.put('/:id', AddressController.update)//Edit
router.delete('/:id', AddressController.delete)//Delete

router.get('/customer/:id', AddressController.getAddressByCustomer)

export default router