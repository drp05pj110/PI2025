"use client";
import Link from "next/link";
import { useState } from "react";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";

export default function products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Função para buscar clientes com base no filtro
  async function fetchProducts() {
    try {
      const response = await api.get("/products", {
        params: { search }, // Envia o filtro para o backend
      });
      setProducts(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      alert("Erro ao buscar produto. Tente novamente!");
    }
  }

  // Lida com a submissão do formulário de busca
  function handleSubmit(event) {
    event.preventDefault(); // Evita o reload da página
    fetchProducts(); // Faz a busca
  }

  return (
    <main className={Styles.container}>
      <h1>Consulta de produtos</h1>

      {/* Formulário de busca */}
      <form className={Styles.form} onSubmit={handleSubmit}>
        <div className={Styles.buttonContainer}>
          <input
            type="text"
            name="search"
            placeholder="Digite parte do nome do produto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={Styles.inputrow}
          />
          <button type="submit" className={Styles.button}>
            Filtrar Produto
          </button>
        </div>
      </form>

      {/* Lista de clientes */}
      <div className={Styles.listCustomers}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id}>
              <Link
                href={
                  {
                     pathname: '/dashboard/queries/product/show',
                     query: {id: product.id}, 
                  }
                }
                className={Styles.customerItem}
              >
                <div className={Styles.tag}></div>
                <span>{product.name}</span>
              </Link>
            </div>
          ))
        ) : (
          <p className={Styles.row}>Nenhum produto encontrado.</p>
        )}
      </div>
    </main>
  );
}