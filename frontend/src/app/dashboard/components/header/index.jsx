"use client"

import Link from 'next/link'
import Styles from './Styles.module.css'
import Image from 'next/image'
import logoImg from '/public/logo.png'
import { LogOutIcon } from 'lucide-react'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Header() {
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)

    async function handleLogout() {
        deleteCookie('session', { path: '/' })
        router.replace('/')
    }

    // Função para fechar o menu após clicar em um link
    function handleMenuLinkClick() {
        setMenuOpen(false)
    }

    return (
        <header className={Styles.headerContainer}>
            <div className={Styles.headerContent}>
                <Link href='/dashboard'>
                    <Image
                        alt='DRP05'
                        src={logoImg}
                        width={60}
                        height={60}
                        priority={true}
                        quality={100}
                    />
                </Link>

                {/* Ícone do menu hambúrguer */}
                <button
                    className={Styles.menuToggle}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={menuOpen ? Styles.barOpen : ''}></span>
                    <span className={menuOpen ? Styles.barOpen : ''}></span>
                    <span className={menuOpen ? Styles.barOpen : ''}></span>
                </button>

                {/* Menu */}
                <nav className={`${Styles.navMenu} ${menuOpen ? Styles.menuOpen : ''}`}>
                    <Link href='/dashboard/registrations' onClick={handleMenuLinkClick}>
                        Cadastros
                    </Link>
                    <Link href='/dashboard/queries' onClick={handleMenuLinkClick}>
                        Consultas
                    </Link>
                    <Link href='/dashboard/scheduling' onClick={handleMenuLinkClick}>
                        Agendamentos
                    </Link>
                    <form action={handleLogout}>
                        <button type='submit'>
                            <LogOutIcon size={24} color='#fff' />
                        </button>
                    </form>
                </nav>
            </div>
        </header>
    )
}