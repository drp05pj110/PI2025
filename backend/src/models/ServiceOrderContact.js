import Sequelize, { Model } from 'sequelize'

export default class ServiceOrderContact extends Model {
    static init(sequelize){
        super.init({
            order_id: 
            {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            contact_id: 
            {
                type: Sequelize.STRING,
                defaultValue: '',
            },
        }, {sequelize})

        return this
    }
}