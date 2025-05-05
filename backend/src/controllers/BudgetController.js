import Budget from "../models/Budget"

class BudgetController{
    async store(req, res){
        try {
            const budget = req.body
            const newBudget = await Budget.create(budget)
            res.json(newBudget)
            
        } catch (e) {
            return res.status(400).json({
                errors: e.errors.map((err)=>err.message)
            })
        }
       
    }
    async index(req, res){
        const budget = await Budget.findAll()
        res.json(budget)
    }
    async show(req, res){
        try {
            const { id } = req.params
            if(!id){
                return res.status(400).json({
                    errors: ['Faltando ID!']
                })
            }

            const budget = await Budget.findByPk(id)
            if(!budget){
                return res.status(400).json({
                    errors: ['Funcionário não cadastrado!']
                })
            }

            res.json(budget)

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

            const budget = await Budget.findByPk(id)
            if(!budget){
                return res.status(400).json({
                    errors: ['Orçamento não cadastrado!']
                })
            }

            const newBudget = req.body
            await budget.update(newBudget)
             res.json(budget)

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

        const budget = await Budget.findByPk(id)
        if(!budget){
            return res.status(400).json({
                errors: ['Orçamento não cadastrado!']
            })
        }
        
        await budget.destroy()
        res.json({Delete: true})

    } catch (e) {
        return res.status(400).json({
            errors: e.errors.map((err)=>err.message)
        })
    }}
}

export default new BudgetController()