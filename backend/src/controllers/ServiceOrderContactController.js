import ServiceOrderContact from "../models/ServiceOrderContact"


class ServiceOrderContactController {
    async store(req, res) {
          try {
                    const serviceOrderContact = req.body
                    const newServiceOrderContact = await ServiceOrderContact.create(serviceOrderContact)
                    res.json(newServiceOrderContact)
                    
                } catch (e) {
                    return res.status(400).json({
                       errors: e.errors.map((err)=>err.message)
                    })
                    
                }
    }

    async index(req, res) {
        const serviceOrderContact = await ServiceOrderContact.findAll();
        res.json(serviceOrderContact);
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ['Faltando ID!']
                });
            }

            const serviceOrderContact = await ServiceOrderContact.findByPk(id);
            if (!serviceOrderContact) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            res.json(serviceOrderContact);

        } catch (e) {
            return res.status(400).json({
                errors: e.errors ? e.errors.map((err) => err.message) : [e.message]
            });
        }
    }

    async update(req, res) {
       try {
                  const { id } = req.params
                  if(!id){
                      return res.status(400).json({
                          errors: ['Faltando ID!']
                      })
                  }
      
                  const serviceOrderContact = await ServiceOrderContact.findByPk(id)
                  if(!serviceOrderContact){
                      return res.status(400).json({
                          errors: ['Serviço não cadastrado!']
                      })
                  }
      
                  const newServiceOrderContact = req.body
                  await serviceOrderContact.update(newServiceOrderContact)
                   res.json(serviceOrderContact)
      
              } catch (e) {
                  return res.status(400).json({
                      errors: e.errors.map((err)=>err.message)
                  })
              }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ['Faltando ID!']
                });
            }

            const serviceOrderContact = await ServiceOrderContact.findByPk(id);
            if (!serviceOrderContact) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            await serviceOrderContact.destroy();
            res.json({ Delete: true });

        } catch (e) {
            return res.status(400).json({
                errors: e.errors ? e.errors.map((err) => err.message) : [e.message]
            });
        }
    }

    async getServiceOrderCategoryByOrderId(req, res) {
        try {
            const { id } = req.params; // order-id
            console.log(req.params);
            const serviceOrderContact = await ServiceOrderContact.findAll({ where: { 'order_id': id } });
            res.json(serviceOrderContact);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                errors: e
            });
        }
    }

    async getServiceOrderCategoryByContactId(req, res) {
        try {
            const { id } = req.params; // category-id
            console.log(req.params);
            const serviceOrderContact = await ServiceOrderContact.findAll({ where: { 'contact_id': id } });
            res.json(serviceOrderContact);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                errors: e
            });
        }
    }
}

export default new ServiceOrderContactController();
