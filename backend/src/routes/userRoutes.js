import { Router } from "express"
import UserController from '../controllers/UserController'

import loginRequired from "../middlewares/loginRequired"


const router = new Router()
//Não é comum em sistemas
router.get('/', UserController.index)//show all users
//Sow user login
router.get('/me', loginRequired, UserController.show)//show one user
//Essas rotas devem ser altenticadas
router.post('/', UserController.store)//create a user
//O id será retirado do token
router.put('/', UserController.update)//update user
router.delete('/', UserController.delete)//delete user


export default router