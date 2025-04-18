import ServiceOrder from "../models/ServiceOrder"
import ServiceOrderContact from "../models/ServiceOrderContact"
import { Op } from "sequelize"
import moment from "moment" // Adicione a importação do moment

class ServiceOrderController {
    async store(req, res) {
        try {
            const serviceOrder = req.body;

            const {contact_ids} = serviceOrder
            console.log(contact_ids)

            // Converte a execução da data para o formato YYYY-MM-DD
            const formattedDate = moment(serviceOrder.execution_date, "DD/MM/YYYY").format("YYYY-MM-DD");

            // Verifica se a data é válida
            if (!moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
                return res.status(400).json({
                    errors: ['Data de execução inválida. Use o formato DD/MM/YYYY.']
                });
            }

            // Atualiza a data convertida no objeto
            serviceOrder.execution_date = formattedDate;

            // Cria a Ordem de Serviço
            const newServiceOrder = await ServiceOrder.create(serviceOrder);

            contact_ids.map((contact) => {
                contact.order_id = newServiceOrder.dataValues.id
            }).forEach(contact =>{//e posição do objeto na interação do array
                ServiceOrderContact.create(contact)
            })
            
            res.json(newServiceOrder);

        } catch (e) {
            console.log(e);
            return res.status(400).json({
                errors: e.errors ? e.errors.map((err) => err.message) : [e.message]
            });
        }
    }

    async index(req, res) {
        let status = undefined
        if(req.query.search)
            status = { [Op.like]: `%${req.query.search}%` }
        let page = req.query.page || 0
        let startDate = req.query.startDate
        let endDate = req.query.endDate
        let execution_date = undefined
        let where = undefined

        if(startDate && endDate) {
            execution_date = {
                
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  
            }
        }

        if(status || execution_date) {
            where = {
                status, 
                execution_date
            };
        }
        console.log(where)
        const serviceOrder = await ServiceOrder.findAndCountAll({
            where,
            limit: 5,
            offset: 5 * parseInt(page)
            
        })
        res.json(serviceOrder);
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ['Faltando ID!']
                });
            }

            const serviceOrder = await ServiceOrder.findByPk(id);
            if (!serviceOrder) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            res.json(serviceOrder);

        } catch (e) {
            return res.status(400).json({
                errors: e.errors ? e.errors.map((err) => err.message) : [e.message]
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ['Faltando ID!']
                });
            }

            const serviceOrder = await ServiceOrder.findByPk(id);
            if (!serviceOrder) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            const newServiceOrder = req.body;

            // Verifica e formata a data de execução
            if (newServiceOrder.execution_date) {
                const formattedDate = moment(newServiceOrder.execution_date, "DD/MM/YYYY").format("YYYY-MM-DD");
                if (!moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
                    return res.status(400).json({
                        errors: ['Data de execução inválida. Use o formato DD/MM/YYYY.']
                    });
                }
                newServiceOrder.execution_date = formattedDate;
            }

            await ServiceOrder.update(newServiceOrder, { where: { id } });
            res.json({ message: "Ordem de serviço atualizada com sucesso!" });

        } catch (e) {
            return res.status(400).json({
                errors: e.errors ? e.errors.map((err) => err.message) : [e.message]
            });
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

            const serviceOrder = await ServiceOrder.findByPk(id);
            if (!serviceOrder) {
                return res.status(400).json({
                    errors: ['Ordem de serviço não cadastrada!']
                });
            }

            await serviceOrder.destroy();
            res.json({ Delete: true });

        } catch (e) {
            return res.status(400).json({
                errors: e.errors ? e.errors.map((err) => err.message) : [e.message]
            });
        }
    }

    async getServiceOrderByCustomer(req, res) {
        try {
            const { id } = req.params; // customer-id
            console.log(req.params);
            const serviceOrder = await ServiceOrder.findAll({ where: { 'customer_id': id } });
            res.json(serviceOrder);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                errors: e
            });
        }
    }

    async getServiceOrderByAddress(req, res) {
        try {
            const { id } = req.params; // address-id
            console.log(req.params);
            const serviceOrder = await ServiceOrder.findAll({ where: { 'address_id': id } });
            res.json(serviceOrder);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                errors: e
            });
        }
    }

}

export default new ServiceOrderController();
