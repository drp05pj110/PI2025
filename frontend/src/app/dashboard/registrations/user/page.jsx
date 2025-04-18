import Image from 'next/image'
import Link from 'next/link'
import Styles from './Styles.module.css'
import {api} from '@/services/api'

export default function Signup(){

    async function handleRegister(formData){
      "use server"
      const name = formData.get('name')
      const email = formData.get('email')
      const password = formData.get('password')
      console.log(name)
      console.log(email)
      console.log(password)

      try {
        await api.post('/users', {
         name,
         email,
         password,
       })
       
     } catch (err) {
       console.log(err)
     }
    }
    return(
        <>
    <div className={Styles.container}>
         <h1>Cadastro de Usuário</h1>
          <form action = {handleRegister} className={Styles.form}>
          <input
              type='text'
              required
              name='name'
              placeholder='Digite o nome do usuário.'
              className={Styles.input}
            />
            <input
              type='email'
              required
              name='email'
              placeholder='Digite o e-mail do usuário.'
              className={Styles.input}
            />
            <input
              type='password'
              required
              name='password'
              placeholder='*************'
              className={Styles.input}
            />
            <div className={Styles.buttonContainer}>
                <button type='submit'className={Styles.button}>
                    Cadastrar
                </button>
            </div>
          </form>
      </div>
        </>
    )
}