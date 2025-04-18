"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Styles from './Styles.module.css';
import { api } from '@/services/api';

export default function Employee() {
    const [message, setMessage] = useState('');
    const router = useRouter();

    async function handleRegister(formData) {
        const name = formData.get('name');
        const position = formData.get('position');

        try {
            const response = await api.post('/employees', {
                name,
                position,
            });

            const employee = response.data; // Assuma que a API retorna o cliente no formato { id, ... }

            // Armazena o customer_id no localStorage
            localStorage.setItem('name', employee.name)
            // Armazena a sazão Social no localStorage
            localStorage.setItem('position',employee.position)
            
            setMessage('Funcionário cadastrado com sucesso!');
            router.push('/dashboard/registrations/employee'); // Redireciona sem passar parâmetros
       
        } catch (err) {
            console.log(err);
            setMessage('Erro ao cadastrar Funcionário! Tente novamente.');
        }

        setTimeout(() => setMessage(''), 3000);
    }

    return (
        <main className={Styles.container}>
            <h1>Cadastro de Funcionário</h1>

            {message && <div className={Styles.flashMessage}>{message}</div>}

            <form action={handleRegister} className={Styles.form}>
                <input
                    type="text"
                    name="name"
                    placeholder="Digite o nome do(a) Funcionário(a)"
                    required
                    className={Styles.input}
                />
                <input
                    type="text"
                    name="position"
                    placeholder="Digite a dunção do(a) funcionário(a)"
                    required
                    className={Styles.input}
                />
                <div className={Styles.buttonContainer}>
                    <button className={Styles.button}>
                        Cadastrar
                    </button>
                </div>
            </form>
        </main>
    );
}