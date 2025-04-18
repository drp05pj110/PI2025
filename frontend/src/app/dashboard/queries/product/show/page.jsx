"use client"; // Indica que o componente será executado no cliente
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Para acessar parâmetros da URL
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function CategoryDetails() {
  const searchParams = useSearchParams(); // Hook para acessar parâmetros da URL
  const [product, setProduct] = useState(null);
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

    // Função para buscar os dados do cliente e endereços
    async function fetchData() {
      try {
        // Busca dados do produto
        const productResponse = await api.get(`/products/${id}`);
        setProduct(productResponse.data);


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
  async function handleProductDelete(productId) {
    try {
      const id = productId  
      await api.delete(`/products/${id}`)

         // Redireciona após sucesso
         router.push(`/dashboard/queries/product`)

    } catch (err) {
      constole.log(err)
    }
    
  }

  return (
    <main className={Styles.container}>
      <div className={Styles.containerCustomerButtons}>
        <h1>Produto</h1>
      </div>
     
      {/* Dados do produto */}
      {product ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}>Producto: {product.name}</label>
          <label className={Styles.row}>Descrição: {product.description}</label>
          <label className={Styles.row}>Numero do registro: {product.registry}</label>
          <label className={Styles.row}>concentração/quantidade: {product.unity_of_mensure}</label>
        <div className={Styles.containerCustomerButtons}>
          <Link className={Styles.addressItem}
            href={{
                 pathname: '/dashboard/registrations/product',
                 }}>
            Novo Produto
          </Link>
          <button className={Styles.addressItem} onClick={()=>handleProductDelete(product.id)} >
                  Excluir
          </button>
          <Link className={Styles.addressItem}
            href={{
                 pathname: '/dashboard/queries/product/edit',
                 query: {id: product.id}
                 }}>
            Editar
          </Link>
        </div>
        </div>
      ) : (
        <p>Produto não encontrada.</p>
      )}
    </main>
  );
}