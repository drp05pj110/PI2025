import User from "../models/User"

class PhotoController{
    async store(req, res){
        res.json('Foto!')
    }
}
export default new PhotoController()