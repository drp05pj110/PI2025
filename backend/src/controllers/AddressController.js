import Address from "../models/Address"

class AddressController{
    async store(req, res){
        try {
            const address = req.body
            const newAddress = await Address.create(address)
            res.json(newAddress)
            
        } catch (e) {
            return res.status(400).json({
               errors: e.errors.map((err)=>err.message)
            })
            
        }
       
    }
    async index(req, res){
        const address = await Address.findAll()
        res.json(address)
    }
    async show(req, res){
        try {
            const { id } = req.params
            if(!id){
                return res.status(400).json({
                    errors: ['Faltando ID!']
                })
            }

            const address = await Address.findByPk(id)
            if(!address){
                return res.status(400).json({
                    errors: ['Endereço não cadastrado!']
                })
            }

            res.json(address)

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

            const address = await Address.findByPk(id)
            if(!address){
                return res.status(400).json({
                    errors: ['Endereço não cadastrado!']
                })
            }

            const newAddress = req.body
            await address.update(newAddress)
             res.json(address)

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

        const address = await Address.findByPk(id)
        if(!address){
            return res.status(400).json({
                errors: ['Endereço não cadastrado!']
            })
        }
        
        await address.destroy()
        res.json({Delete: true})

    } catch (e) {
        return res.status(400).json({
            errors: e.errors.map((err)=>err.message)
        })
    }}
    async getAddressByCustomer (req, res) {
        try {
            const {id} = req.params // customer-id
            console.log(req.params)
            const addresses = await Address.findAll({where: {'customer_id': id}})
            res.json(addresses)
        }catch (e) {
            // tratar tipo de exceptiolns
            console.error(e)
            return res.status(500).json({
                errors: e
            })
        }
    }
}

export default new AddressController()