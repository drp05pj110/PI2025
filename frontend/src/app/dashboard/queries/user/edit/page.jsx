"use client"; // Indica que o componente será executado no cliente
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Para acessar parâmetros da URL e navegar
import Styles from "./Styles.module.css";
import { api } from "@/services/api";

export default function CustomerDetails() {
  const searchParams = useSearchParams(); // Hook para acessar parâmetros da URL
  const [employee, setEmployee] = useState(null); // Estado para armazenar os dados do funcionário
  const [error, setError] = useState(false); // Estado para gerenciar erros
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento
  const [message, setMessage] = useState(""); // Estado para exibir mensagens ao usuário
  const router = useRouter(); // Hook para redirecionamento

  // Carrega os dados do produto com base no ID passado na URL
  useEffect(() => {
    const id = searchParams.get("id"); // Obtém o valor de `id` da URL

    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const employeeResponse = await api.get(`/employees/${id}`); // Busca os dados do Clientes
        setEmployee(employeeResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados do Funcionário:", err);
        setError(true);
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  

  // Função para atualizar os dados do produto
  async function handleUpdate(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    const id = searchParams.get("id"); // Obtém o valor de `id` da URL

    // Obtém os valores do formulário
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const position = formData.get("position");
    

    try {
        await api.put(`/employees/${id}`, {
        name,
        position,
      });
      
      setMessage("Funcionário atualizado com sucesso!"); // Mensagem de sucesso
      router.push(`/dashboard/queries/employee/show?id=${id}`); // Redireciona para a página de produtos
    } catch (err) {
      console.error("Erro ao atualizar Funcionário:", err);
      setMessage("Erro ao atualizar Funcionário! Tente novamente."); // Mensagem de erro
    }

    setTimeout(() => setMessage(""), 3000); // Limpa a mensagem após 3 segundos
  }

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return <p>Erro ao carregar os dados. Verifique e tente novamente.</p>;
  }

  return (
    <main className={Styles.container}>
      <h1>Editando os dados do Funcionário</h1>

      {/* Exibição do Cliente */}
      {employee ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}>Funcionário: {employee.name}</label>
          <label className={Styles.row}>Função: {employee.position}</label>
        </div>
      ) : (
        <p>Funcionário não encontrado.</p>
      )}

      {/* Formulário de edição */}
      <form onSubmit={handleUpdate} className={Styles.form}>

        {/* Inputs para edição */}
        <input
          type="text"
          name="name"
          defaultValue={employee.name}
          placeholder="Nome"
          className={Styles.input}
        />
        <input
          type="text"
          name="position"
          defaultValue={employee.position}
          placeholder="Função"
          className={Styles.input}
        />

        {/* Botão de atualização */}
        <div className={Styles.buttonContainer}>
          <button type="submit" className={Styles.button}>
            Atualizar dados
          </button>
        </div>
      </form>

      {/* Exibição de mensagens */}
      {message && <p>{message}</p>}
    </main>
  );
}
