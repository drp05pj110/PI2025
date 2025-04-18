import Sequelize, { Model } from 'sequelize'

export default class Employee extends Model {
    static init(sequelize){
        super.init({
            name: {
                type: Sequelize.STRING,
                defaultValue: '',
                validate: {
                    len: {
                        args: [3, 50],
                        msg: 'O nome tem que ter no mínimo 3 caracters!'
                    }
                }   
            },
            position: Sequelize.STRING,
        }, {sequelize})
        return this
    }
}