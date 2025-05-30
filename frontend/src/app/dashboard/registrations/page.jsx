import Link from 'next/link'
import Styles from './Style.module.css'

export default function Registrations(){
    return(
        <main className={Styles.container}>
            
        <section className={Styles.containerHeader}>
            <h1>Cadastros:</h1>
        </section>

        <section className={Styles.listRegistrations}>
            <Link href='/dashboard/registrations/customer' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>Cliente</span>   
            </Link>
            <Link href='/dashboard/registrations/category' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>Tipo de Serviço</span>   
            </Link>
            <Link href='/dashboard/registrations/product' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>Produtos para o serviço</span>   
            </Link>
            <Link href='/dashboard/registrations/employee' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>Funcionário</span>   
            </Link>
        </section>

    </main>
    )
}