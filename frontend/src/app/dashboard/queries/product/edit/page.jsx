"use client"; // Indica que o componente será executado no cliente
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Para acessar parâmetros da URL e navegar
import Styles from "./Styles.module.css";
import { api } from "@/services/api";

export default function ProductDetails() {
  const searchParams = useSearchParams(); // Hook para acessar parâmetros da URL
  const [product, setProduct] = useState(null); // Estado para armazenar os dados do produto
  const [categories, setCategories] = useState([]); // Estado para armazenar categorias
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
        const productResponse = await api.get(`/products/${id}`); // Busca os dados do produto
        setProduct(productResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados do produto:", err);
        setError(true);
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  // Carrega as categorias disponíveis
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/categorys"); // Busca categorias da API
        setCategories(response.data);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        setMessage("Erro ao carregar categorias!");
      }
    }

    fetchCategories();
  }, []);

  // Função para atualizar os dados do produto
  async function handleUpdate(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    const id = searchParams.get("id"); // Obtém o valor de `id` da URL

    // Obtém os valores do formulário
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const description = formData.get("description");
    const category_id = formData.get("category_id");
    const registry = formData.get("registry");
    const unity_of_mensure = formData.get("unity_of_mensure");

    try {
      const product = await api.put(`/products/${id}`, {
        name,
        description,
        category_id,
        registry,
        unity_of_mensure,
      });
      
      setMessage("Produto atualizado com sucesso!"); // Mensagem de sucesso
      router.push(`/dashboard/queries/product/show?id=${id}`); // Redireciona para a página de produtos
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      setMessage("Erro ao atualizar produto! Tente novamente."); // Mensagem de erro
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
      <h1>Editando o Produto</h1>

      {/* Exibição do produto */}
      {product ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}>Produto: {product.name}</label>
        </div>
      ) : (
        <p>Produto não encontrado.</p>
      )}

      {/* Formulário de edição */}
      <form onSubmit={handleUpdate} className={Styles.form}>
        {/* Seleção de categorias */}
        <select name="category_id" className={Styles.input} defaultValue="">
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Inputs para edição */}
        <input
          type="text"
          name="name"
          defaultValue={product.name}
          placeholder="Nome do produto"
          className={Styles.input}
        />
        <input
          type="text"
          name="description"
          defaultValue={product.description}
          placeholder="Descrição do produto"
          className={Styles.input}
        />
        <input
          type="text"
          name="registry"
          defaultValue={product.registry}
          placeholder="Registro"
          className={Styles.input}
        />
        <input
          type="text"
          name="unity_of_mensure"
          defaultValue={product.unity_of_mensure}
          placeholder="Unidade de medida"
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
