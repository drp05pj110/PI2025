import Sequelize, { Model } from 'sequelize'

export default class ServiceOrderProduct extends Model {
    static init(sequelize){
        super.init({
            order_id: 
            {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            product_id: 
            {
                type: Sequelize.STRING,
                defaultValue: '',
            },
        }, {sequelize})

        return this
    }
}