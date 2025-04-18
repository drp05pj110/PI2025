"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPage] = useState(0);
  const [dateFilter, setDateFilter] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 5),
      key: 'selection'
    }
  ]);
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addDays(new Date(), 5))
  

  async function getOrders(page) {
    try {
      const response = await api.get("/serviceorders", {
        params: { search: "aberta", page, startDate, endDate }, // Envia o filtro para o backend
      });
      return response.data;
    } catch (err) {
      console.error("Erro ao buscar OS:", err);
      alert("Erro ao buscar OS. Tente novamente!");
      return { rows: [], count: 0 };
    }
  }

  async function onChangeDateFilter(params) {
    console.log(params)  
    
    setDateFilter([params.selection])
    setStartDate(params.selection.startDate)
    setEndDate(params.selection.endDate)
    setCurrentPage(0)

  }


  async function fetchOrders() {
    const data = await getOrders(currentPages);
    setOrders(data.rows || []);

    const count = data.count || 0;
    setTotalPages(Math.ceil(count / 5)); // Corrigido para arredondar corretamente

    if (data.rows.length > 0) {
      fetchCustomerDetails(data.rows);
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

  function nextPage() {
    if (currentPages + 1 < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }

  function prevPage() {
    if (currentPages > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }


  useEffect(() => {
    fetchOrders();
  }, [currentPages]); // Sempre busca as OS quando a página muda

  return (
    <main className={Styles.container}>
      <h1>Tatal de Paginas {totalPages}</h1>
        <DateRangePicker
          color={'#000000'}
          onChange={onChangeDateFilter}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={dateFilter}
          direction="horizontal"
        />;
        <button onClick={()=> fetchOrders()}>Filtrar</button>

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

          <div className={Styles.containerBtnNav}>
              <button onClick={prevPage} disabled={currentPages === 0}
              className={Styles.btnNav}>
                Anterior
              </button>
              <button onClick={nextPage} disabled={currentPages + 1 >= totalPages}
              className={Styles.btnNav}>
                Próximo
              </button>
          </div>

      </div>
    </main>
  );
}
