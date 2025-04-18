import Sequelize, { Model } from 'sequelize'
import bcryptjs from 'bcryptjs'

export default class User extends Model {
    static init(sequelize){
        super.init({
            name: 
            {
                type: Sequelize.STRING,
                defaultValue: '',
                validate:{
                    len :{
                        args: [3, 255],
                        msg: 'O nome deve conter entre 3 e 255 caracters!'
                    }
                }

            },
            email:  {
                type: Sequelize.STRING,
                defaultValue: '',
                unique:{
                    msg: 'Este e-mail já está em uso!'
                },
                validate:{
                    isEmail :{
                        msg: 'O e-mail é invalido!'
                    }
                }

            },
            password_hash: {
                type: Sequelize.STRING,
                defaultValue: '',
            },
            password:  {
                type: Sequelize.VIRTUAL,
                defaultValue: '',
                validate:{
                    len :{
                        args: [3, 50],
                        msg: 'A senha deve conter no mínimo 3 caracteres!'
                    }
                }

            },
        }, {sequelize})

        this.addHook('beforeSave', async user =>{
            if(user.password){
                user.password_hash = await bcryptjs.hash(user.password, 3)
            }
        })

        return this
    }

    passwordIsValid(password){
        return bcryptjs.compare(password, this.password_hash)
    }
}