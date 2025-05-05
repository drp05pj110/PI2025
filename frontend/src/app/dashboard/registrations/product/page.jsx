"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Styles from './Styles.module.css';
import { api } from '@/services/api';

export default function Product() {
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]); // Estado para armazenar categorias
    const router = useRouter();

    // Função para carregar categorias ao montar o componente
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await api.get('/categorys'); // Busca categorias da API
                setCategories(response.data); // Atualiza o estado com os dados da API
            } catch (err) {
                console.error('Erro ao buscar categorias:', err);
                setMessage('Erro ao carregar categorias!');
            }
        }

        fetchCategories();
    }, []);

    async function handleRegister(formData) {
        const name = formData.get('name');
        const description = formData.get('description');
        const category_id = formData.get('category_id');
        const registry = formData.get('registry');
        const unity_of_mensure = formData.get('unity_of_mensure');

        try {
            await api.post('/products', {
                name,
                description,
                category_id,
                registry,
                unity_of_mensure,
            });

            setMessage('Produto cadastrado com sucesso!');
            router.push('/dashboard/registrations/product'); // Redireciona para a página de categorias
        } catch (err) {
            console.error('Erro ao cadastrar produto:', err);
            setMessage('Erro ao cadastrar produto! Tente novamente.');
        }

        setTimeout(() => setMessage(''), 3000); // Limpa a mensagem após 3 segundos
    }

    return (
        <main className={Styles.container}>
            <h1>Cadastro de Produto para serviços</h1>

            {/* Exibição de mensagens */}
            {message && <div className={Styles.flashMessage}>{message}</div>}

            <form action={handleRegister} className={Styles.form}>
                <select name="category_id" className={Styles.input} required>
                    <option value="" disabled selected>
                        Selecione uma categoria
                    </option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="name"
                    placeholder="Digite o nome do produto que será usado."
                    required
                    className={Styles.input}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Descrição do produto"
                    required
                    className={Styles.input}
                />
                <input
                    type="text"
                    name="registry"
                    placeholder="Digite permanente ou troca"
                    required
                    className={Styles.input}
                />
                <input
                    type="text"
                    name="unity_of_mensure"
                    placeholder="Digite quantidade"
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
