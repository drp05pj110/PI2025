import Sequelize, { Model } from 'sequelize'

export default class Product extends Model {
    static init(sequelize){
        super.init({
            name:  {
                type: Sequelize.STRING,
                defaultValue: '',
                validate:{
                    len :{
                        args: [3, 255],
                        msg: 'O nome do produto deve conter no minimo 3 dígitos!'
                    }
                }

            },
            description: 
            {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            category_id: 
            {
                type: Sequelize.INTEGER,
                defaultValue: '',

            },
           registry:
             {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            unity_of_mensure:  {
                type: Sequelize.STRING,
                defaultValue: '',

            },
           
        }, {sequelize})

        return this
    }
}