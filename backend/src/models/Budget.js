import Sequelize, { Model } from 'sequelize'

export default class Budget extends Model {
    static init(sequelize){
        super.init({
              order_id: {
                type: Sequelize.STRING,
                allowNull: false,
              },
              validity: {
                type: Sequelize.STRING,
                allowNull: true,
              },
              cash: {
                type: Sequelize.STRING,
                allowNull: true,
              },
           
        }, {sequelize})

        return this
    }
}