import ServiceOrderProduct from "../models/ServiceOrderProduct"


class ServiceOrderProductController {
    async store(req, res) {
          try {
                    const serviceOrderProduct = req.body
                    const newServiceOrderProduct = await ServiceOrderProduct.create(serviceOrderProduct)
                    res.json(newServiceOrderProduct)
                    
                } catch (e) {
                    return res.status(400).json({
                       errors: e.errors.map((err)=>err.message)
                    })
                    
                }
    }

    async index(req, res) {
        const serviceOrderProduct = await ServiceOrderProduct.findAll();
        res.json(serviceOrderProduct);
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ['Faltando ID!']
                });
            }

            const serviceOrderProduct = await ServiceOrderProduct.findByPk(id);
            if (!serviceOrderProduct) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            res.json(serviceOrderProduct);

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
      
                  const serviceOrderProduct = await ServiceOrderProduct.findByPk(id)
                  if(!serviceOrderProduct){
                      return res.status(400).json({
                          errors: ['Serviço não cadastrado!']
                      })
                  }
      
                  const newServiceOrderProduct = req.body
                  await serviceOrderProduct.update(newServiceOrderProduct)
                   res.json(serviceOrderProduct)
      
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

            const serviceOrderProduct = await ServiceOrderProduct.findByPk(id);
            if (!serviceOrderProduct) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            await serviceOrderProduct.destroy();
            res.json({ Delete: true });

        } catch (e) {
            return res.status(400).json({
                errors: e.errors ? e.errors.map((err) => err.message) : [e.message]
            });
        }
    }

    async getServiceOrderCategoryByProductId(req, res) {
        try {
            const { id } = req.params; // order-id
            console.log(req.params);
            const serviceOrderProduct = await ServiceOrderProduct.findAll({ where: { 'product_id': id } });
            res.json(serviceOrderProduct);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                errors: e
            });
        }
    }

    async getServiceOrderCategoryByOrderId(req, res) {
        try {
            const { id } = req.params; // category-id
            console.log(req.params);
            const serviceOrderProduct = await ServiceOrderProduct.findAll({ where: { 'order_id': id } });
            res.json(serviceOrderProduct);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                errors: e
            });
        }
    }
}

export default new ServiceOrderProductController();
