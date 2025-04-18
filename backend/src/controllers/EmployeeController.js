import Employee from "../models/Employee"

class EmployeeController{
    async store(req, res){
        try {
            const employee = req.body
            const newEmployee = await Employee.create(employee)
            res.json(newEmployee)
            
        } catch (e) {
            return res.status(400).json({
                errors: e.errors.map((err)=>err.message)
            })
        }
       
    }
    async index(req, res){
        const employee = await Employee.findAll()
        res.json(employee)
    }
    async show(req, res){
        try {
            const { id } = req.params
            if(!id){
                return res.status(400).json({
                    errors: ['Faltando ID!']
                })
            }

            const employee = await Employee.findByPk(id)
            if(!employee){
                return res.status(400).json({
                    errors: ['Funcionário não cadastrado!']
                })
            }

            res.json(employee)

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

            const employee = await Employee.findByPk(id)
            if(!employee){
                return res.status(400).json({
                    errors: ['Funcionário não cadastrado!']
                })
            }

            const newEmployee = req.body
            await employee.update(newEmployee)
             res.json(employee)

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

        const employee = await Employee.findByPk(id)
        if(!employee){
            return res.status(400).json({
                errors: ['Funcionário não cadastrado!']
            })
        }
        
        await employee.destroy()
        res.json({Delete: true})

    } catch (e) {
        return res.status(400).json({
            errors: e.errors.map((err)=>err.message)
        })
    }}
}

export default new EmployeeController()