import Sequelize, { Model } from 'sequelize'

export default class ServiceOrder extends Model {
    static init(sequelize){
        super.init({
            customer_id: 
            {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            address_id: 
            {
                type: Sequelize.STRING,
                defaultValue: '',
            },
            status:
            {
                type: Sequelize.STRING,
                defaultValue: '',
            },
            validity: {
                type: Sequelize.STRING,
                defaultValue: '',
              },
            observations:
            {
                type: Sequelize.STRING,
                defaultValue: '',
            },
            issue_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
              },
              execution_date: {
                type: Sequelize.DATE,
                allowNull: false,
              },
              execution_time: {
                type: Sequelize.TIME,
                allowNull: false,
              },
        }, {sequelize})

        return this
    }
}