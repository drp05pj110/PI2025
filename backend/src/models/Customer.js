import Sequelize, { Model } from 'sequelize'

export default class Customer extends Model {
    static init(sequelize){
        super.init({
            identification_type: 
            {
                type: Sequelize.STRING,
                defaultValue: '',
                validate:{
                    len :{
                        args: [2, 255],
                        msg: 'A identificação tem que ser pf ou pj!'
                    }
                }

            },
            identification: 
            {
                type: Sequelize.STRING,
                defaultValue: '',
                validate:{
                    len :{
                        args: [2, 255],
                        msg: 'A identificação deve conter no minimo 6 dígitos!'
                    }
                }

            },
            corporate_reason:  {
                type: Sequelize.STRING,
                defaultValue: '',
                validate:{
                    len :{
                        args: [3, 255],
                        msg: 'A Razão social deve conter no minimo 3 dígitos!'
                    }
                }

            },
            fantasy_name:  {
                type: Sequelize.STRING,
                defaultValue: '',
                validate:{
                    len :{
                        args: [3, 255],
                        msg: 'O nome fantasia deve conter no minimo 3 dígitos!'
                    }
                }

            },
        }, {sequelize})

        return this
    }
}