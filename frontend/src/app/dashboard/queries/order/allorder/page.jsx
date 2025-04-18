"use client";
import Link from "next/link";
import { useState } from "react";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [customerDetails, setCustomerDetails] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false); // Controla se os dados devem ser exibidos

  async function fetchOrders(page = 0) {
    try {
      const response = await api.get("/serviceorders", {
        params: { search, page }, // Envia o filtro para o backend
      });

      setOrders(response.data.rows || []);
      const count = response.data.count || 0;
      setTotalPages(Math.ceil(count / 5)); // Ajuste para arredondar corretamente

      if (response.data.rows.length > 0) {
        fetchCustomerDetails(response.data.rows);
      }
    } catch (err) {
      console.error("Erro ao buscar OS:", err);
      alert("Erro ao buscar OS. Tente novamente!");
    }
  }

  async function fetchCustomerDetails(orders) {
    try {
      const requests = orders.map((order) =>
        api.get(`/customers/${order.customer_id}`).catch(() => null)
      );
      const responses = await Promise.all(requests);

      const customerDetailsMap = {};
      orders.forEach((order, index) => {
        customerDetailsMap[order.customer_id] =
          responses[index]?.data || { fantasy_name: "Cliente não encontrado" };
      });

      setCustomerDetails(customerDetailsMap);
    } catch (err) {
      console.error("Erro ao buscar detalhes dos clientes:", err);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setCurrentPage(0); // Sempre começar da primeira página ao buscar
    setIsFiltered(true); // Ativa a exibição da lista de OS
    fetchOrders(0);
  }

  function nextPage() {
    if (currentPage + 1 < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchOrders(newPage);
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchOrders(newPage);
    }
  }

  return (
    <main className={Styles.container}>
      <h1>Consultar OS</h1>

      {/* Formulário de busca */}
      <form className={Styles.form} onSubmit={handleSearch}>
        <div className={Styles.buttonContainer}>
          <input
            type="text"
            name="search"
            placeholder="OS aberta ou fechada"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={Styles.inputrow}
          />
          <button type="submit" className={Styles.button}>
            Filtrar OS
          </button>
        </div>
      </form>

      {/* Lista de OS só será exibida após clicar em "Filtrar OS" */}
      {isFiltered && (
        <>
          <div className={Styles.listCustomers}>
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id}>
                  <Link
                    href={{
                      pathname: "/dashboard/queries/order/actionorders",
                      query: { id: order.id },
                    }}
                    className={Styles.customerItem}
                  >
                    <div className={Styles.tag}></div>
                    <span className={Styles.spanOreder}>OS: {order.id} - </span>
                    <span className={Styles.spanOreder}>
                      Cliente: {customerDetails[order.customer_id]?.fantasy_name || "Carregando..."}
                    </span>
                  </Link>
                </div>
              ))
            ) : (
              <p className={Styles.row}>Nenhuma ordem encontrada.</p>
            )}
          </div>

          {/* Botões de Paginação */}
          {totalPages > 1 && (
            <div className={Styles.containerBtnNav}>
              <button
                className={Styles.btnNav}
                onClick={prevPage}
                disabled={currentPage === 0} // Desabilita quando está na primeira página
              >
                Anterior
              </button>
              <button
                className={Styles.btnNav}
                onClick={nextPage}
                disabled={currentPage + 1 >= totalPages} // Desabilita quando está na última página
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
