

import logo from '/public/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import Styles from '../page.module.css'
import {api} from '@/services/api'
import { redirect } from 'next/navigation'

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
     redirect('/')
    }
    return(
        <>
           <div className={Styles.containerCenter}>
        <Image
        src={logo}
        alt='Sakai Controll'
        />
        <section className={Styles.login}>
         <h1>Cadastro de Usuário</h1>
          <form action = {handleRegister}>
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
            <button type='submit'className={Styles.button}>
              Cadastrar
            </button>
          </form>
          <Link href='/'  className={Styles.text}>
            Já tem conta? clique aqui!
          </Link>
        </section>
      </div>
        </>
    )
}