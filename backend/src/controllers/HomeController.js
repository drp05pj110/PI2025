import User from "../models/User"

class HomeController{
    async index(req, res){
        res.json('index')
    }
}
export default new HomeController()