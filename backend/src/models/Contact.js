import Sequelize, { Model } from 'sequelize'

export default class Contact extends Model {
    static init(sequelize){
        super.init({
            customer_id:  {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            contact_name: 
            {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            contact_information: 
            {
                type: Sequelize.STRING,
                defaultValue: '',

            },
           type:
             {
                type: Sequelize.STRING,
                defaultValue: '',

            },
           
        }, {sequelize})

        return this
    }
}