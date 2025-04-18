import Product from "../models/Product"

class ProductController{
    async store(req, res){
        try {
            const product = req.body
            const newProduct = await Product.create(product)
            res.json(newProduct)
            
        } catch (e) {
            return res.status(400).json({
               errors: e.errors.map((err)=>err.message)
            })
            
        }
       
    }
    async index(req, res){
        const product = await Product.findAll()
        res.json(product)
    }
    async show(req, res){
        try {
            const { id } = req.params
            if(!id){
                return res.status(400).json({
                    errors: ['Faltando ID!']
                })
            }

            const product = await Product.findByPk(id)
            if(!product){
                return res.status(400).json({
                    errors: ['Produto não cadastrado!']
                })
            }

            res.json(product)

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

            const product = await Product.findByPk(id)
            if(!product){
                return res.status(400).json({
                    errors: ['Produto não cadastrado!']
                })
            }

            const newProduct = req.body
            await product.update(newProduct)
             res.json(product)

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

        const product = await Product.findByPk(id)
        if(!product){
            return res.status(400).json({
                errors: ['Produto não cadastrado!']
            })
        }
        
        await product.destroy()
        res.json({Delete: true})

    } catch (e) {
        return res.status(400).json({
            errors: e.errors.map((err)=>err.message)
        })
    }}
     async getProductByCategory (req, res) {
            try {
                const {id} = req.params // category-id
                console.log(req.params)
                const products = await Product.findAll({where: {'category_id': id}})
                res.json(products)
            }catch (e) {
                // tratar tipo de exceptiolns
                console.error(e)
                return res.status(500).json({
                    errors: e
                })
            }
        }
}

export default new ProductController()