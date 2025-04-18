"use client"; // Indica que o componente será executado no cliente
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Para acessar parâmetros da URL e navegar
import Styles from "./Styles.module.css";
import { api } from "@/services/api";

export default function CustomerDetails() {
  const searchParams = useSearchParams(); // Hook para acessar parâmetros da URL
  const [customer, setCustomer] = useState(null); // Estado para armazenar os dados do produto
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
        const customerResponse = await api.get(`/customers/${id}`); // Busca os dados do Clientes
        setCustomer(customerResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados do cliente:", err);
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
    const corporate_reason = formData.get("corporate_reason");
    const fantasy_name = formData.get("fantasy_name");
    const identification_type = formData.get("identification_type");
    const identification = formData.get("identification");
    

    try {
      const customer = await api.put(`/customers/${id}`, {
        corporate_reason,
        fantasy_name,
        identification_type,
        identification,
      });
      
      setMessage("Cliente atualizado com sucesso!"); // Mensagem de sucesso
      router.push(`/dashboard/queries/customer/show?id=${id}`); // Redireciona para a página de produtos
    } catch (err) {
      console.error("Erro ao atualizar Cliente:", err);
      setMessage("Erro ao atualizar Cliente! Tente novamente."); // Mensagem de erro
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
      <h1>Editando os dados do Cliente</h1>

      {/* Exibição do Cliente */}
      {customer ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}> {customer.identification_type}</label>  
          <label className={Styles.row}>Cliente: {customer.corporate_reason}</label>
          <label className={Styles.row}>Nome Dantasia: {customer.fantasy_name}</label>
        </div>
      ) : (
        <p>Produto não encontrado.</p>
      )}

      {/* Formulário de edição */}
      <form onSubmit={handleUpdate} className={Styles.form}>

        {/* Inputs para edição */}
        <input
          type="text"
          name="corporate_reason"
          defaultValue={customer.corporate_reason}
          placeholder="Razão Social/Nome"
          className={Styles.input}
        />
        <input
          type="text"
          name="fantasy_name"
          defaultValue={customer.fantasy_name}
          placeholder="Nome fantasia/Nome"
          className={Styles.input}
        />
         <select name='identification_type' className={Styles.input}
         defaultValue={customer.identification_type}>
                    <option value="" disabled selected>
                        Selecione o tipo de Pessoa
                    </option>
                    <option value='Pessoa Jurídica'>Pessoa Jurídica</option>
                    <option value='Pessoa Física'>Pessoa Física</option>
        </select>
        <input
          type="text"
          name="identification"
          defaultValue={customer.identification}
          placeholder="CNPJ/CPF"
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
