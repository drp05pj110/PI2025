"use client";
import Link from "next/link";
import { useState } from "react";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  // Função para buscar Funcionários com base no filtro
  async function fetchEmployees() {
    try {
      const response = await api.get("/employees", {
        params: { search }, // Envia o filtro para o backend
      });
      setEmployees(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar Funcionário:", err);
      alert("Erro ao buscar Funcionários. Tente novamente!");
    }
  }

  // Lida com a submissão do formulário de busca
  function handleSubmit(event) {
    event.preventDefault(); // Evita o reload da página
    fetchEmployees(); // Faz a busca
  }

  return (
    <main className={Styles.container}>
      <h1>Consulta de Funcionários</h1>

      {/* Formulário de busca */}
      <form className={Styles.form} onSubmit={handleSubmit}>
        <div className={Styles.buttonContainer}>
          <input
            type="text"
            name="search"
            placeholder="Digite parte do nome do funcionário"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={Styles.inputrow}
          />
          <button type="submit" className={Styles.button}>
            Filtrar Funcionário
          </button>
        </div>
      </form>

      {/* Lista de funcionários */}
      <div className={Styles.listCustomers}>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <div key={employee.id}>
              <Link
                href={
                  {
                     pathname: '/dashboard/queries/employee/show',
                     query: {id: employee.id}, 
                  }
                }
                className={Styles.customerItem}
              >
                <div className={Styles.tag}></div>
                <span>{employee.name}</span>
              </Link>
            </div>
          ))
        ) : (
          <p className={Styles.row}>Nenhum funcionário encontrado.</p>
        )}
      </div>
    </main>
  );
}