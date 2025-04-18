"use client";
import Link from "next/link";
import { useState } from "react";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";

export default function Employee() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Função para buscar Funcionários com base no filtro
  async function fetchUser() {
    try {
      const response = await api.get("/users", {
        params: { search }, // Envia o filtro para o backend
      });
      setUsers(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar Funcionário:", err);
      alert("Erro ao buscar Funcionários. Tente novamente!");
    }
  }

  // Lida com a submissão do formulário de busca
  function handleSubmit(event) {
    event.preventDefault(); // Evita o reload da página
    fetchUser(); // Faz a busca
  }

  return (
    <main className={Styles.container}>
      <h1>Consulta de Usuários do Sistema</h1>

      {/* Formulário de busca */}
      <form className={Styles.form} onSubmit={handleSubmit}>
        <div className={Styles.buttonContainer}>
          <input
            type="text"
            name="search"
            placeholder="Digite parte do nome do usuário"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={Styles.inputrow}
          />
          <button type="submit" className={Styles.button}>
            Filtrar usuário
          </button>
        </div>
      </form>

      {/* Lista de funcionários */}
      <div className={Styles.listCustomers}>
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id}>
              <Link
                href={
                  {
                     pathname: '/dashboard/queries/user/show',
                     query: {id: user.id}, 
                  }
                }
                className={Styles.customerItem}
              >
                <div className={Styles.tag}></div>
                <span>{user.name}</span>
              </Link>
            </div>
          ))
        ) : (
          <p className={Styles.row}>Nenhum usuário encontrado.</p>
        )}
      </div>
    </main>
  );
}