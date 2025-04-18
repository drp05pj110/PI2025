import User from "../models/User"

class UserController{
    //STORE - CREATE USER
    async store(req, res){
        try {

            const user = await User.create(req.body)
            const {name, email, id} = user
            return res.status(200).json({name, email, id})
        } catch (e) {
            return res.status(400).json({errors: e.errors.map((err)=> err.message)

            })
        }                          
    }

    //INDEX - LIST ALL USERS
    async index(req, res){
        
        try {
            
            const users = await User.findAll({attributes: ['name', 'email', 'id']})
            return res.json(users)
        } catch (error) {
            return res.json(null)
        }
    }

    //SHOW - LIST ONE USER
    async show(req, res){
        try {
            const id = req.params.id
            const user = await User.findByPk(req.userId)
            const name = user.name
            const email = user.email
            const UserID = user.id
            return res.json( {name, email, UserID} )
        } catch (error) {
            return res.json(null)
        }
    }

    //UPDATE - EDIT ONE USER
    async update(req, res){
        try {
            const user = await User.findByPk(req.userId)
            if (!user){
                return res.status(400).json({
                    errors: ['Usuário não existe!'],
                })   
            }
            await user.update(req.body)

            const {name, email, id} = user

            return res.json({name, email, id})
        } catch (e) {
            return res.status(400)
            .json({errors: e.errors.map((err)=> err.message)
            })    
        }
    }

    //DELETE - DELETE ONE USER
    async delete(req, res){
        try {
            const id = req.body.id
            if (!id){
                return res.status(400).json({
                    errors: ['ID não enviado!'],
                })   
            }
            const user = await User.findByPk(id)
            if (!user){
                return res.status(400).json({
                    errors: ['Usuário não existe!'],
                })   
            }
            await user.destroy()

            return res.json(user)
        } catch (e) {
            return res.status(400)
            .json({errors: e.errors.map((err)=> err.message)
            })    
        }
    }

}
export default new UserController()