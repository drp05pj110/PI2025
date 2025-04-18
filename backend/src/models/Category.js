import Sequelize, { Model } from 'sequelize'

export default class Category extends Model {
    static init(sequelize){
        super.init({
            name:  {
                type: Sequelize.STRING,
                defaultValue: '',
                validate:{
                    len :{
                        args: [3, 255],
                        msg: 'O nome deve conter no minimo 3 dígitos!'
                    }
                },
            },
        }, {sequelize})

        return this
    }
}