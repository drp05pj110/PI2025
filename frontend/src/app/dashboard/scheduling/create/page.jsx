"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Styles from "./Styles.module.css";
import Link from "next/link";
import { api } from "@/services/api";

export default function CreateServiceOrder() {
  const searchParams = useSearchParams();
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);


  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) setDate(dateParam);
  }, [searchParams]);

  useEffect(() => {
    if (search.trim()) fetchCustomers();
  }, [search]);


   // Função para buscar clientes com base no filtro
   async function fetchCustomers() {
    try {
      const response = await api.get("/customers", {
        params: { search }, // Envia o filtro para o backend
      });
      setCustomers(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      alert("Erro ao buscar clientes. Tente novamente!");
    }
  }

  // Lida com a submissão do formulário de busca
  function handleSubmit(event) {
    event.preventDefault(); // Evita o reload da página
    fetchCustomers(); // Faz a busca
  }

  return (
    <main className={Styles.container}>
      <h1>Consulta de Clientes</h1>

      {/* Formulário de busca */}
      <form className={Styles.form} onSubmit={handleSubmit}>
        <div className={Styles.buttonContainer}>
          <input
            type="text"
            name="search"
            placeholder="Digite parte da razão social ou do nome do cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={Styles.inputrow}
          />
          <button type="submit" className={Styles.button}>
            Filtrar Cliente
          </button>
        </div>
      </form>

      {/* Lista de clientes */}
      <div className={Styles.listCustomers}>
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div key={customer.id}>
              <Link
                href={
                  {
                     pathname: '/dashboard/scheduling/create/address',
                     query: {
                      customer_id: customer.id,
                      date: date
                    }, 
                  }
                }
                className={Styles.customerItem}
              >
                <div className={Styles.tag}></div>
                <span>{customer.corporate_reason}</span>
              </Link>
            </div>
          ))
        ) : (
          <p className={Styles.row}>Nenhum cliente encontrado.</p>
        )}
      </div>
    </main>
  );
}