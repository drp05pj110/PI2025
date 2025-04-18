import ServiceOrderEmployee from "../models/ServiceOrderEmployee"


class ServiceOrderEmployeeController {
    async store(req, res) {
          try {
                    const serviceOrderEmployee = req.body
                    const newServiceOrderEmployee = await ServiceOrderEmployee.create(serviceOrderEmployee)
                    res.json(newServiceOrderEmployee)
                    
                } catch (e) {
                    return res.status(400).json({
                       errors: e.errors.map((err)=>err.message)
                    })
                    
                }
    }

    async index(req, res) {
        const serviceOrderEmployee = await ServiceOrderEmployee.findAll();
        res.json(serviceOrderEmployee);
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ['Faltando ID!']
                });
            }

            const serviceOrderEmployee = await ServiceOrderEmployee.findByPk(id);
            if (!serviceOrderEmployee) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            res.json(serviceOrderEmployee);

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
      
                  const serviceOrderEmployee = await ServiceOrderEmployee.findByPk(id)
                  if(!serviceOrderEmployee){
                      return res.status(400).json({
                          errors: ['Serviço não cadastrado!']
                      })
                  }
      
                  const newServiceOrderEmployee = req.body
                  await serviceOrderEmployee.update(newServiceOrderEmployee)
                   res.json(serviceOrderEmployee)
      
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

            const serviceOrderEmployee = await ServiceOrderEmployee.findByPk(id);
            if (!serviceOrderEmployee) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            await serviceOrderEmployee.destroy();
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
            const serviceOrderEmployee = await ServiceOrderEmployee.findAll({ where: { 'order_id': id } });
            res.json(serviceOrderEmployee);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                errors: e
            });
        }
    }

    async getServiceOrderCategoryByEmployeeId(req, res) {
        try {
            const { id } = req.params; // employee-id
            console.log(req.params);
            const serviceOrderEmployee = await ServiceOrderEmployee.findAll({ where: { 'employee_id': id } });
            res.json(serviceOrderEmployee);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                errors: e
            });
        }
    }
}

export default new ServiceOrderEmployeeController();
