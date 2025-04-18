
"use client"; // Indica que o componente será executado no cliente
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Para acessar parâmetros da URL
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function CustomerDetails() {
  const searchParams = useSearchParams(); // Hook para acessar parâmetros da URL
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); // Adicionado estado de carregamento
  const router = useRouter()

  useEffect(() => {
    const id = searchParams.get("id"); // Obtém o valor de `id` da URL

    if (!id) {
      setError(true);
      setLoading(false); // Encerra o carregamento
      return;
    }

    // Função para buscar os dados do funcionário
    async function fetchData() {
      try {
        // Busca dados do cliente
        const userResponse = await api.get(`/users/${id}`);
        setUser(userResponse.data);

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
  async function handleUserDelete(userId) {
    try {
      const id = userId  
      await api.delete(`/users/${id}`)
     
      // Redireciona após sucesso
      router.push(`/dashboard/queries/user`)

    } catch (err) {
      constole.log(err)
    }
    
  }
 
  return (
    <main className={Styles.container}>
      <div className={Styles.containerCustomerButtons}>
        <h1>Usuários</h1>
        <Link href={'/dashboard/registrations/user'}
        className={Styles.button}> Cadastrar Usuário</Link>
      </div>
     
      {/* Dados do Funcionário */}
      {user ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}>Nome: {user.name}</label>
          <label className={Styles.row}>Função: {user.email}</label>
        <div className={Styles.containerCustomerButtons}>
          <button className={Styles.addressItem} onClick={()=>handleUserDelete(user.id)} >
                  Excluir
          </button>
          <Link className={Styles.addressItem}
            href={{pathname: '/dashboard/queries/user/edit',
              query: {id: user.id},
              }}>
            Atualizar
          </Link>
        </div>
        </div>
      ) : (
        <p>Cliente não encontrado.</p>
      )}
    </main>
  );
}