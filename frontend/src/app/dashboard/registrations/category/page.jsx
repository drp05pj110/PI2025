"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Styles from './Styles.module.css';
import { api } from '@/services/api';

export default function Category() {
    const [message, setMessage] = useState('');
    const router = useRouter();

    async function handleRegister(formData) {
        const name = formData.get('name');
       
        try {
            const response = await api.post('/categorys', {
               name,
            });

            const category = response.data; // Assuma que a API retorna o cliente no formato { id, ... }

            // Armazena o category_id no localStorage
            localStorage.setItem('category_id', category.id)
            // Armazena a sazão Social no localStorage
            localStorage.setItem('name', category.name)
            
            setMessage('Categoria cadastrada com sucesso!');
            router.push('/dashboard/registrations/category'); // Redireciona sem passar parâmetros
       
        } catch (err) {
            console.log(err);
            setMessage('Erro ao cadastrar categoria! Tente novamente.');
        }

        setTimeout(() => setMessage(''), 3000);
    }

    return (
        <main className={Styles.container}>
            <h1>Cadastro de Categoria de serviços</h1>

            {message && <div className={Styles.flashMessage}>{message}</div>}

            <form action={handleRegister} className={Styles.form}>
                <div className={Styles.buttonContainer}>
                <input
                    type="text"
                    name="name"
                    placeholder="Digite a categoria(ex.: Manutenção, Limpeza, Instalação ...)"
                    required
                    className={Styles.rowinput}
                />
                    <button className={Styles.button}>
                        Cadastrar 
                    </button>
                </div>
            </form>
        </main>
    );
}