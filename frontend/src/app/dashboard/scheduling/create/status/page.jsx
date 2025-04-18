"use client"; // Indica que o componente será executado no cliente
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Para acessar parâmetros da URL
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';

// Função para formatar a data no formato DD/MM/YYYY para exibição
function formatDateForDisplay(date) {
  const dateParts = date.split("-"); // Exemplo: ["2025", "02", "04"]
  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // "04/02/2025"
}

// Função para formatar a data no formato YYYY-MM-DD para envio à API
function formatDateForAPI(date) {
  const dateParts = date.split("/"); // Exemplo: ["04", "02", "2025"]
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // "2025-02-04"
}

export default function CustomerDetails() {
  const searchParams = useSearchParams();
  const [customer, setCustomer] = useState(null);
  const [address, setAddress] = useState(null);
  const [contact, setContact] = useState(null);
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [customerId, setCustomerId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const customer_id = searchParams.get("customer_id");
    const address_id = searchParams.get("address_id");
    const contact_id = searchParams.get("contact_id");
    const dateParam = searchParams.get("date");

    if (dateParam) setDate(dateParam);
    if (customer_id) setCustomerId(customer_id);

    if (!customer_id) {
      setError(true);
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const customerResponse = await api.get(`/customers/${customer_id}`);
        setCustomer(customerResponse.data);

        if (address_id) {
          const addressResponse = await api.get(`/addresses/${address_id}`);
          setAddress(addressResponse.data);
        }

        if (contact_id) {
          const contactResponse = await api.get(`/contacts/${contact_id}`);
          setContact(contactResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(true);
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

  async function handleRegister(event) {
    event.preventDefault();

    if (!customerId || !address?.id ) {
      setMessage("Erro: Dados incompletos para registrar a ordem de serviço.");
      console.error("Dados ausentes:", { customerId, address });
      return;
    }

    const formData = new FormData(event.target);
    let execution_time = formData.get("execution_time");
    const validity = formData.get("validity");
    const observations = formData.get("observations");

    if (execution_time.length === 5) {
      execution_time = `${execution_time}:00`; // Garante formato HH:MM:SS
    }

    const execution_date = formatDateForDisplay(date);

    const newOrder = {
      execution_time,
      observations,
      status: "aberta",
      validity,
      customer_id: customerId,
      address_id: address.id,
      execution_date,
      contact_ids: []
    };

    if(contact?.id){
      newOrder.contact_ids.push({
        contact_id: contact.id
      }) 
    }
    console.log("Dados enviados para API:", newOrder);

    try {
      const response = await api.post("/serviceorders", newOrder);
      console.log(" Resposta da API:", response.data);
      
      if(response.data){
        
        if(contact?.id){
          const newOrderId = response.data.id
          const ordeContact = {
            order_id: newOrderId,
            contact_id: contact.id
          }
          await api.post('/serviceorderscontacts', ordeContact)
        }
       
      }
      setMessage("Ordem cadastrada com sucesso!");
      router.push(`/dashboard/scheduling/create/category?id=${response.data.id}`);
    } catch (err) {
      console.error(" Erro ao cadastrar ordem:", err.response?.data || err.message);

      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((error) => {
          console.error(`Erro no campo: ${error.path} → ${error.message}`);
        });
      }

      setMessage(`Erro ao cadastrar ordem! ${err.response?.data?.message || "Verifique os campos e tente novamente."}`);
    }


    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <main className={Styles.container}>
      <div className={Styles.containerCustomerButtons}>
        <h1>Cliente</h1>
        <Link href={{ pathname: "/dashboard/scheduling/create", query: { date: date } }} className={Styles.button}>
          Outro Cliente
        </Link>
      </div>

      {customer ? (
        <div className={Styles.containerCustomerDetails}>
          <h2>Data do Serviço: {formatDateForDisplay(date)}</h2>
          <label className={Styles.row}>{customer.identification_type}</label>
          <label className={Styles.row}>Razão Social: {customer.corporate_reason}</label>
          <label className={Styles.row}>Nome Fantasia: {customer.fantasy_name}</label>
          <p className={Styles.row}>CNPJ/CPF: {customer.identification}</p>
          {address && <p className={Styles.row}>Endereço: {address.street}</p>}
          {contact && <p className={Styles.row}>Contato: {contact.contact_name}</p>}
        </div>
      ) : (
        <p>Cliente não encontrado.</p>
      )}

      <form onSubmit={handleRegister} className={Styles.form}>
        <input type="time" name="execution_time" required className={Styles.input} />
        <input type="text" name="validity" placeholder="Digite a garantia em meses" className={Styles.input} />
        <input type="text" name="observations" placeholder="Observações" className={Styles.input} />
        <div className={Styles.buttonContainer}>
          <button className={Styles.button}>Próximo</button>
        </div>
      </form>

      {message && <p className={Styles.message}>{message}</p>}
    </main>
  );
}
