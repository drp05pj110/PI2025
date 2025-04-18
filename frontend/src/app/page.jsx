import styles from './page.module.css'
import logoImg from '/public/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import {api} from '@/services/api'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function Page(){
    async function handleLogin(formData) {
        "use server"
        
        const email = formData.get('email')
        const password = formData.get('password')

        if(email === "" || password === ""){
            return;
        }
        try {
            
            const response = await api.post('/tokens', {
                email, 
                password
            })

            if(!response.data.token){
                return
            }

            console.log(response.data)

            const expressTime = 60*60*24*30*1000
            const cookieStore = await cookies()
            cookieStore.set('session', response.data.token, {
                maxAge: expressTime,
                path: '/',
                httpOnly: false,
              
            })


        } catch (err) {
            console.log(err)
            return
        }

        redirect('/dashboard')

    }
  return(
    <>
      <div className={styles.containerCenter}>
        <Image
          src={logoImg}
          alt="Logo da Sakai"
        />

        <section className={styles.login}>
          <form action={handleLogin}>
            <input 
              type="email"
              required
              name="email"
              placeholder="Digite seu email..."
              className={styles.input}
            />

            <input 
              type="password"
              required
              name="password"
              placeholder="***********"
              className={styles.input}
            />

            <button type="submit" className={styles.button}>
              Acessar
            </button>
          </form>

          <Link href="/signup" className={styles.text}>
            Não possui uma conta? Cadastre-se
          </Link>

        </section>

      </div>      
    </>
  )
}