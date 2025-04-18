"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Styles from './Styles.module.css';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function Contact() {
    const [message, setMessage] = useState('');
    const searchParams = useSearchParams(); // Hook para acessar parâmetros da URL
    const [customer, setCustomer] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true); // Adicionado estado de carregamento
    const router = useRouter();

    useEffect(() => {
        const id = searchParams.get("id"); // Obtém o valor de `id` da URL
    
        if (!id) {
          setError(true);
          setLoading(false); // Encerra o carregamento
          return;
        }
    
        // Função para buscar os dados do cliente e endereços
        async function fetchData() {
          try {
            // Busca dados do cliente
            const customerResponse = await api.get(`/customers/${id}`);
            setCustomer(customerResponse.data);
    
            setLoading(false); // Conclui o carregamento
          } catch (err) {
            console.error("Erro ao carregar dados:", err);
            setError(true);
            setLoading(false); // Conclui o carregamento mesmo com erro
          }
        }
    
        fetchData();
      }, [searchParams]); // Executa sempre que os parâmetros da URL mudarem
    
      if (loading) {
        return <p>Carregando dados...</p>;
      }
    
      if (error) {
        return <p>Erro ao carregar os dados. Verifique e tente novamente.</p>;
      }
    
    async function handleRegister(formData) {
        const customer_id =  customer.id
        const contact_name = formData.get('contact_name');
        const contact_information = formData.get('contact_information');
        const type = formData.get('type');

        try {
            await api.post('/contacts', {
                customer_id,
                contact_name,
                contact_information,
                type,
            });
            setMessage('Contato cadastrado com sucesso!');
            

            // Redireciona após sucesso
            router.push(`/dashboard/queries/customer/show?id=${customer_id}`);
        } catch (err) {
            console.error(err);
            setMessage('Erro ao cadastrar o contato! Tente novamente.');
        }

        setTimeout(() => setMessage(''), 3000); // Limpa a mensagem após 3 segundos
    }

    return (
        <main className={Styles.container}>
            <label className={Styles.exibitionCustomer}>{customer.corporate_reason}</label>
            <h1>Cadastro de Contato</h1>

            {message && <div className={Styles.flashMessage}>{message}</div>}

            <form action={handleRegister} className={Styles.form}>
                <input
                    type="text"
                    name="contact_name"
                    placeholder="Digite o nome do contato"
                    required
                    className={Styles.input}
                />
                <input
                    type="text"
                    name="type"
                    placeholder="Digite o tipo de contato (ex.: telefone, email...)"
                    required
                    className={Styles.input}
                />
                <input
                    type="text"
                    name="contact_information"
                    placeholder="Digite o contato"
                    required
                    className={Styles.input}
                />
                <div className={Styles.buttonContainer}>
                    <button className={Styles.button}>
                        Cadastrar contato
                    </button>
                </div>
            </form>
        </main>
    );
}