import ServiceOrderCategory from "../models/ServiceOrderCategory"


class ServiceOrderCategoryController {
    async store(req, res) {
          try {
                    const serviceOrderCategory = req.body
                    const newServiceOrderCategory = await ServiceOrderCategory.create(serviceOrderCategory)
                    res.json(newServiceOrderCategory)
                    
                } catch (e) {
                    return res.status(400).json({
                       errors: e.errors.map((err)=>err.message)
                    })
                    
                }
    }

    async index(req, res) {
        const serviceOrderCategory = await ServiceOrderCategory.findAll();
        res.json(serviceOrderCategory);
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ['Faltando ID!']
                });
            }

            const serviceOrderCategory = await ServiceOrderCategory.findByPk(id);
            if (!serviceOrderCategory) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            res.json(serviceOrderCategory);

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
      
                  const serviceOrderCategory = await ServiceOrderCategory.findByPk(id)
                  if(!serviceOrderCategory){
                      return res.status(400).json({
                          errors: ['Serviço não cadastrado!']
                      })
                  }
      
                  const newServiceOrderCategory = req.body
                  await serviceOrderCategory.update(newServiceOrderCategory)
                   res.json(serviceOrderCategory)
      
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

            const serviceOrderCategory = await ServiceOrderCategory.findByPk(id);
            if (!serviceOrderCategory) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            await serviceOrderCategory.destroy();
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
            const serviceOrderCategory = await ServiceOrderCategory.findAll({ where: { 'order_id': id } });
            res.json(serviceOrderCategory);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                errors: e
            });
        }
    }

    async getServiceOrderCategoryByCategoryId(req, res) {
        try {
            const { id } = req.params; // category-id
            console.log(req.params);
            const serviceOrderCategory = await ServiceOrderCategory.findAll({ where: { 'category_id': id } });
            res.json(serviceOrderCategory);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                errors: e
            });
        }
    }
}

export default new ServiceOrderCategoryController();
