"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Styles from './Styles.module.css';
import { api } from '@/services/api';

export default function Customer() {
    const [message, setMessage] = useState('');
    const router = useRouter();

    async function handleRegister(formData) {
        const identification_type = formData.get('identification_type');
        const identification = formData.get('identification');
        const corporate_reason = formData.get('corporate_reason');
        const fantasy_name = formData.get('fantasy_name');

        try {
            const response = await api.post('/customers', {
                identification_type,
                identification,
                corporate_reason,
                fantasy_name,
            });

            const customer = response.data; // Assuma que a API retorna o cliente no formato { id, ... }


           {/* // Armazena o customer_id no localStorage
            localStorage.setItem('customer_id', customer.id)
            // Armazena a sazão Social no localStorage
            localStorage.setItem('corporate_reason', customer.corporate_reason)
           */}
            setMessage('Cliente cadastrado com sucesso!');
            router.push(`/dashboard/queries/customer/show?id=${customer.id}`); 
       
        } catch (err) {
            console.log(err);
            setMessage('Erro ao cadastrar cliente! Tente novamente.');
        }

        setTimeout(() => setMessage(''), 3000);
    }

    return (
        <main className={Styles.container}>
            <h1>Cadastro de Cliente</h1>

            {message && <div className={Styles.flashMessage}>{message}</div>}

            <form action={handleRegister} className={Styles.form}>
                <select name='identification_type' className={Styles.input}>
                    <option value="" disabled selected>
                        Selecione o tipo de Pessoa
                    </option>
                    <option value='Pessoa Jurídica'>Pessoa Jurídica</option>
                    <option value='Pessoa Física'>Pessoa Física</option>
                </select>
                <input
                    type="text"
                    name="identification"
                    placeholder="Digite o CPF ou o CNPJ"
                    required
                    className={Styles.input}
                />
                <input
                    type="text"
                    name="corporate_reason"
                    placeholder="Digite a razão social ou o nome do cliente"
                    required
                    className={Styles.input}
                />
                <input
                    type="text"
                    name="fantasy_name"
                    placeholder="Digite o nome fantasia ou o nome do cliente"
                    required
                    className={Styles.input}
                />
                <div className={Styles.buttonContainer}>
                    <button className={Styles.button}>
                        Cadastrar Cliente
                    </button>
                </div>
            </form>
        </main>
    );
}