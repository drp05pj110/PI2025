"use client";
import Link from "next/link";
import { useState } from "react";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // Função para buscar clientes com base no filtro
  async function fetchCategories() {
    try {
      const response = await api.get("/categorys", {
        params: { search }, // Envia o filtro para o backend
      });
      setCategories(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar categoria:", err);
      alert("Erro ao buscar categoria. Tente novamente!");
    }
  }

  // Lida com a submissão do formulário de busca
  function handleSubmit(event) {
    event.preventDefault(); // Evita o reload da página
    fetchCategories(); // Faz a busca
  }

  return (
    <main className={Styles.container}>
      <h1>Consultar Tipo de Serviço</h1>

      {/* Formulário de busca */}
      <form className={Styles.form} onSubmit={handleSubmit}>
        <div className={Styles.buttonContainer}>
          <input
            type="text"
            name="search"
            placeholder="Digite parte da categoria do produto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={Styles.inputrow}
          />
          <button type="submit" className={Styles.button}>
            Filtrar Serviço
          </button>
        </div>
      </form>

      {/* Lista de clientes */}
      <div className={Styles.listCustomers}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id}>
              <Link
                href={
                  {
                     pathname: '/dashboard/queries/category/show',
                     query: {id: category.id}, 
                  }
                }
                className={Styles.customerItem}
              >
                <div className={Styles.tag}></div>
                <span>{category.name}</span>
              </Link>
            </div>
          ))
        ) : (
          <p className={Styles.row}>Nenhuma categoria de produto encontrado.</p>
        )}
      </div>
    </main>
  );
}