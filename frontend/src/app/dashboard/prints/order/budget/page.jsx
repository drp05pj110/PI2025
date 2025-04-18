"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';

function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export default function OrdersDetails() {
  const searchParams = useSearchParams();
  const [customer, setCustomer] = useState(null);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [orderId, setOrderId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const orderId = searchParams.get("id");

    if (!orderId) {
      setError(true);
      setLoading(false);
      return;
    }
    setOrderId(orderId);

    async function fetchData() {
      try {
        // Buscar dados da Ordem de Serviço
        const orderResponse = await api.get(`/serviceorders/${orderId}`);
        setOrder(orderResponse.data);

        // Buscar dados do cliente
        const customerResponse = await api.get(`/customers/${orderResponse.data.customer_id}`);
        setCustomer(customerResponse.data);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);


  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return <p>Erro ao carregar os dados. Verifique e tente novamente.</p>;
  }
  async function handleRegister(formData) {
    try {
      const validity = formData.get('validity')
      const cash = formData.get('cash')
      const budget = { 
                  order_id: orderId,
                  validity,
                  cash,
                };
      const response = await api.post('/budget', budget)
      
      const responseBudget = response.data
      
        // Verifica se os valores existem antes de redirecionar
    if (!responseBudget?.order_id || !responseBudget?.id) {
      throw new Error("Dados inválidos retornados da API")
    }

    // Redirecionamento correto
    router.push(`/dashboard/prints/order/budget/printbudget?id=${encodeURIComponent(responseBudget.order_id)}&budget_id=${encodeURIComponent(responseBudget.id)}`)
 

      setMessage("Orçamento concluído com sucesso!")
    } catch (err) {
      console.error("Erro ao concluir OS:", err);
      setMessage("Erro ao concluir OS. Tente novamente.");
    }
  }
  
  return (
    <main className={Styles.container}>
      <div className={Styles.containerCustomerButtons}>
        <h1>Numero da OS {orderId}</h1> 
      </div>

      {order && customer ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}>Situação da OS: {order.status}</label>
          <label className={Styles.row}>Data do Serviço: {formatDateForDisplay(order.execution_date)}</label>
          <label className={Styles.row}>Cliente: {customer.corporate_reason}</label>
        </div>
      ) : (
        <p>Dados não encontrados.</p>
      )}

        <form action={handleRegister} className={Styles.form}>
                <input
                    type="text"
                    name="validity"
                    placeholder="Digite a validade do orçamento"
                    required
                    className={Styles.input}
                />
                <input
                    type="text"
                    name="cash"
                    placeholder="Digite o valor do orçamento"
                    required
                    className={Styles.input}
                />
                <div className={Styles.buttonContainer}>
                    <button className={Styles.categoryItem}>
                        Cadastrar
                    </button>
                    <Link href={
                            {
                              pathname: '/dashboard/queries/order/actionorders',
                              query: {
                                id: orderId
                              }, 
                            }
                          } className={Styles.categoryItem}>
                            Retornar
                  </Link>
                  {message && <p className={Styles.message}>{message}</p>}
                </div>
            </form>
      
    </main>
  );
}