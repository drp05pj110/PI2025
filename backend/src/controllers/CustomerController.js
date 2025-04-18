import Customer from "../models/Customer"
import { Op } from "sequelize"

class CustomerController{
    async store(req, res){
        try {
            const customer = req.body
            const newCustomer = await Customer.create(customer)
            res.json(newCustomer)
            
        } catch (e) {
            //return res.status(400).json({
              //  errors: e.errors.map((err)=>err.message)
            //})
            console.log(e)
            return
        }
       
    }
    async index(req, res){
        let search = ''

        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        }else{
            order = 'DESC'
        }  
        const customer = await Customer.findAll({
            where: {
                corporate_reason: { [Op.like]: `%${search}%` },
            },
            order: [['created_at', order]]
        })
        res.json(customer)
    }
    async show(req, res){
        try {
            const { id } = req.params
            if(!id){
                return res.status(400).json({
                    errors: ['Faltando ID!']
                })
            }

            const customer = await Customer.findByPk(id)
            if(!customer){
                return res.status(400).json({
                    errors: ['Cliente não cadastrado!']
                })
            }

            res.json(customer)

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

            const customer = await Customer.findByPk(id)
            if(!customer){
                return res.status(400).json({
                    errors: ['Cliente não cadastrado!']
                })
            }

            const newCustomer = req.body
            await customer.update(newCustomer)
             res.json(customer)

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

        const customer = await Customer.findByPk(id)
        if(!customer){
            return res.status(400).json({
                errors: ['Cliente não cadastrado!']
            })
        }
        
        await customer.destroy()
        res.json({Delete: true})

    } catch (e) {
        return res.status(400).json({
            errors: e.errors.map((err)=>err.message)
        })
    }}
}

export default new CustomerController()