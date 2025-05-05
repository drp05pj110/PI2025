import Link from 'next/link'
import Styles from './Styles.module.css'

export default function QuerieOrder(){
    return(
        <main className={Styles.container}>
            
        <section className={Styles.containerHeader}>
            <h1>Consultar ordens:</h1>
        </section>

        <section className={Styles.listRegistrations}>
            <Link href='/dashboard/queries/order/allorder' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>Todas</span>   
            </Link>
            <Link href='/dashboard/queries/order/activeorders' className={Styles.registrationItem}>
                <div className={Styles.tag}></div>
                <span>Ativas</span>   
            </Link>
        </section>

    </main>
    )
}