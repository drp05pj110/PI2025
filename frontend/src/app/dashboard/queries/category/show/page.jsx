"use client"; // Indica que o componente será executado no cliente
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Para acessar parâmetros da URL
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function CategoryDetails() {
  const searchParams = useSearchParams(); // Hook para acessar parâmetros da URL
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]); // Estado como array para múltiplos endereços
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
        // Busca dados da categoria
        const categoryResponse = await api.get(`/categorys/${id}`);
        setCategory(categoryResponse.data);

        // Busca dados de produtos
        const productResponse = await api.get(`/products/category/${id}`);
        setProducts(productResponse.data || []); // Garante que addresses seja um array

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
      setProducts((prevProducts) => 
        prevProducts.filter((product) => 
          product.id !== productId));

    } catch (err) {
      constole.log(err)
    }
    
  }
  async function handleCategoryDelete(categoryId) {
    try {
      if(products.length===0){
        const id = categoryId  
        await api.delete(`/categorys/${id}`)

         // Redireciona após sucesso
       router.push(`/dashboard/queries/category`)

      }

    } catch (err) {
      constole.log(err)
    }
    
  }

  return (
    <main className={Styles.container}>
      <div className={Styles.containerCustomerButtons}>
        <h1>Categoria de Produto</h1>
        <Link href={'/dashboard/registrations/category'}
        className={Styles.button}> Cadastrar outra categoria</Link>
      </div>
     
      {/* Dados da Categoria */}
      {category ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}>Categoria: {category.name}</label>
        <div className={Styles.containerCustomerButtons}>
          <Link className={Styles.addressItem}
            href={{
                 pathname: '/dashboard/registrations/product',
                 }}>
            Novo Produto
          </Link>
          <button className={Styles.addressItem} onClick={()=>handleCategoryDelete(category.id)} >
                  Excluir
          </button>
        </div>
        </div>
      ) : (
        <p>Categoria não encontrada.</p>
      )}
      <table>
        <tr>
          <td>
          <h2>Produtos da Categoria</h2>
          </td>
        </tr>
      </table>
       {/* Dados de Contatos */}
       <table className={Styles.tableContainer}>
        <tr>
          <td>
       
      {products.length > 0 ? (
        products.map((product, index) => (
          <table key={index} className={Styles.containerCustomerDetails}>
            <tr>
              <td className={Styles.tdAddress}>
                <label className={Styles.row}>Nome: {product.name}</label>
              </td>
              <td>
                <label className={Styles.row}>descrição:  {product.description}</label>
              </td>
            </tr>
            <tr>
              <td className={Styles.tdAddress}>
                <label className={Styles.row}>Registro na OMS: {product.registry}</label>
              </td>
              <td>
                <label className={Styles.row}>Concentração/Quantidade:  {product.unity_of_mensure}</label>
              </td>
            </tr>
            <tr className={Styles.buttonAddress}>
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
            </tr>
          </table>
        ))
      ) : (
        <p className={Styles.row}>Produtos não encontrados para esta Categoria.</p>
      )}
      </td>
      </tr>
      </table>
    </main>
  );
}