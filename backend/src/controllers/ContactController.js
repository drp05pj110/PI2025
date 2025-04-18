import Contact from "../models/Contact"

class ContactController{
    async store(req, res){
        try {
            const contact = req.body
            const newContact = await Contact.create(contact)
            res.json(newContact)
            
        } catch (e) {
            return res.status(400).json({
               errors: e.errors.map((err)=>err.message)
            })
            
        }
       
    }
    async index(req, res){
        const contact = await Contact.findAll()
        res.json(contact)
    }
    async show(req, res){
        try {
            const { id } = req.params
            if(!id){
                return res.status(400).json({
                    errors: ['Faltando ID!']
                })
            }

            const contact = await Contact.findByPk(id)
            if(!contact){
                return res.status(400).json({
                    errors: ['Contato não cadastrado!']
                })
            }

            res.json(contact)

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

            const contact = await Contact.findByPk(id)
            if(!contact){
                return res.status(400).json({
                    errors: ['Contato não cadastrado!']
                })
            }

            const newContact = req.body
            await contact.update(newContact)
             res.json(contact)

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

        const contact = await Contact.findByPk(id)
        if(!contact){
            return res.status(400).json({
                errors: ['Contato não cadastrado!']
            })
        }
        
        await contact.destroy()
        res.json({Delete: true})

    } catch (e) {
        return res.status(400).json({
            errors: e.errors.map((err)=>err.message)
        })
    }}
    async getContactByCustomer (req, res) {
        try {
            const {id} = req.params // customer-id
            console.log(req.params)
            const contacts = await Contact.findAll({where: {'customer_id': id}})
            res.json(contacts)
        }catch (e) {
            // tratar tipo de exceptiolns
            console.error(e)
            return res.status(500).json({
                errors: e
            })
        }
    }
}

export default new ContactController()