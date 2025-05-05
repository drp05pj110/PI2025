import Link from 'next/link'
import Styles from './Styles.module.css'

export default function Queries(){
    return(
        <main className={Styles.container}>
            
        <section className={Styles.containerHeader}>
            <h1>Consultas</h1>
        </section>

        <section className={Styles.listRegistrations}>
            <Link href='/dashboard/queries/order' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>O.S</span>   
            </Link>
            <Link href='/dashboard/queries/customer' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>Cliente</span>   
            </Link>
            <Link href='/dashboard/queries/category' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>Tipo de Serviço</span>   
            </Link>
            <Link href='/dashboard/queries/product' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>Produto para o serviço</span>   
            </Link>
            <Link href='/dashboard/queries/employee' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>Funcionário</span>   
            </Link>
        </section>

    </main>
    )
}