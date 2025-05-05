import Link from 'next/link'
import Styles from './Styles.module.css'
import { RefreshCcw } from 'lucide-react'

export function Orders(){
    return(
        <main className={Styles.container}>
            
            <section className={Styles.containerHeader}>
                <h1>Ordens de Serviço</h1>
                <button>
                    <RefreshCcw size={24} color='#3fffa3' />
                </button>
            </section>

            <section className={Styles.listOrders}>
                <Link className={Styles.orderItem} href={
                    '/dashboard/queries/order/activeorders'
                }>
                    <div className={Styles.tag}></div>
                    <span>Os: Pendentes</span>   
                </Link>
            </section>

        </main>
    )
}