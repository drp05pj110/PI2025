import Category from "../models/Category"

class CategoryController{
    async store(req, res){
        try {
            const category = req.body
            const newCategory = await Category.create(category)
            res.json(newCategory)
            
        } catch (e) {
            return res.status(400).json({
               errors: e.errors.map((err)=>err.message)
            })
            
        }
       
    }
    async index(req, res){
        const category = await Category.findAll()
        res.json(category)
    }
    async show(req, res){
        try {
            const { id } = req.params
            if(!id){
                return res.status(400).json({
                    errors: ['Faltando ID!']
                })
            }

            const category = await Category.findByPk(id)
            if(!category){
                return res.status(400).json({
                    errors: ['Serviço não cadastrado!']
                })
            }

            res.json(category)

        } catch (e) {
            return res.status(400).json({
                errors: e.errors.map((err)=>err.message)
            })
        }
    }
    async update(req, res){
        try {
            const { id } = req.params
            if(!id){
                return res.status(400).json({
                    errors: ['Faltando ID!']
                })
            }

            const category = await Category.findByPk(id)
            if(!category){
                return res.status(400).json({
                    errors: ['Serviço não cadastrado!']
                })
            }

            const newCategory = req.body
            await category.update(newCategory)
             res.json(category)

        } catch (e) {
            return res.status(400).json({
                errors: e.errors.map((err)=>err.message)
            })
        }
    }
    async delete(req, res){try {
        const { id } = req.params
        if(!id){
            return res.status(400).json({
                errors: ['Faltando ID!']
            })
        }

        const category = await Category.findByPk(id)
        if(!category){
            return res.status(400).json({
                errors: ['Serviço não cadastrado!']
            })
        }
        
        await category.destroy()
        res.json({Delete: true})

    } catch (e) {
        return res.status(400).json({
            errors: e.errors.map((err)=>err.message)
        })
    }}
}

export default new CategoryController()