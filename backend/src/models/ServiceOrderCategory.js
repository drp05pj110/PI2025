import Sequelize, { Model } from 'sequelize'

export default class ServiceOrderCategory extends Model {
    static init(sequelize){
        super.init({
            order_id: 
            {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            category_id: 
            {
                type: Sequelize.STRING,
                defaultValue: '',
            },
        }, {sequelize})

        return this
    }
}