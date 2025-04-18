import Sequelize, { Model } from 'sequelize'

export default class Address extends Model {
    static init(sequelize){
        super.init({
            customer_id:  {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            zip_code: 
            {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            street: 
            {
                type: Sequelize.STRING,
                defaultValue: '',

            },
           beighborhood:
             {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            city:  {
                type: Sequelize.STRING,
                defaultValue: '',
                validate:{
                    len :{
                        args: [3, 255],
                        msg: 'A cidade deve conter no minimo 3 dígitos!'
                    }
                }

            },
            state:  {
                type: Sequelize.STRING,
                defaultValue: '',
                validate:{
                    len :{
                        args: [2, 255],
                        msg: 'O Estado deve conter no minimo 2 dígitos!'
                    }
                }

            },
            number:  {
                type: Sequelize.STRING,
                defaultValue: '',

            },
            aditional_data:  {
                type: Sequelize.STRING,
                defaultValue: '',

            },
        }, {sequelize})

        return this
    }
   
}
