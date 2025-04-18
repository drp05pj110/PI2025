"use client"; // Indica que o componente será executado no cliente
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Para acessar parâmetros da URL
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';
 
export default function CustomerDetails() {
  const searchParams = useSearchParams(); // Hook para acessar parâmetros da URL
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]); // Estado como array para múltiplos endereços
  const [contacts, setContacts] = useState([]); 
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); // Adicionado estado de carregamento
  const router = useRouter()

  function formatDateForDisplay(date) {
    const dateParts = date.split("-"); // Exemplo: ["2025", "02", "04"]
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // "04/02/2025"
  }

  useEffect(() => {
    const customer_id = searchParams.get("customer_id"); // Obtém o valor de `id` da URL
    const dateParam = searchParams.get("date");
    if (dateParam) setDate(dateParam);

    if (!customer_id) {
      setError(true);
      setLoading(false); // Encerra o carregamento
      return;
    }
  
    // Função para buscar os dados do cliente e endereços
    async function fetchData() {
      try {
        // Busca dados do cliente
        const customerResponse = await api.get(`/customers/${customer_id}`);
        setCustomer(customerResponse.data);

        // Busca dados de endereços
        const addressResponse = await api.get(`/addresses/customer/${customer_id}`);
        setAddresses(addressResponse.data || []); // Garante que addresses seja um array

        const contactResponse = await api.get(`/contacts/customer/${customer_id}`);
        setContacts(contactResponse.data || []); //

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
  
  return (
    <main className={Styles.container}>
      <div className={Styles.containerCustomerButtons}>
        <h1>Cliente </h1>
        <Link
            href={{
                 pathname: '/dashboard/scheduling/create',
                 query: { date: date },
              }}
        className={Styles.button}> Outro Cliente</Link>
      </div>
     
      {/* Dados do Cliente */}
      {customer ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}> {customer.identification_type}</label>
          <label className={Styles.row}>Razão Social: {customer.corporate_reason}</label>
          <label className={Styles.row}>Nome fantasia: {customer.fantasy_name}</label>
          <p className={Styles.row}>CNPJ/CPF: {customer.identification}</p>
        <div className={Styles.containerCustomerButtons}>
        <h2> Data da Os: {formatDateForDisplay(date)}</h2>
        </div>
        {selectedAddress && (selectedContact || contacts.length === 0) && (
        <Link href={{
          pathname: '/dashboard/scheduling/create/status',
          query: { date, contact_id: selectedContact?.id || "", address_id: selectedAddress.id,
                   customer_id: customer.id 
           },
        }} className={Styles.button}>Finalizar Seleção</Link>
      )}
        </div>
      ) : (
        <p>Cliente não encontrado.</p>
      )}
      
      <h2>Contatos</h2>
      {selectedContact ? (
        <div className={Styles.containerCustomerDetails}>
          <p className={Styles.row}>Nome: {selectedContact.contact_name}</p>
          <p className={Styles.row}>{selectedContact.type}: {selectedContact.contact_information}</p>
        </div>
      ) : (
        contacts.map((contact) => (
          <button key={contact.id} 
          className={Styles.addressItem}
          onClick={() => setSelectedContact(contact)}>
            {contact.contact_name}
          </button>          
        ))
      )}
      
      <h2>Endereços</h2>
      {selectedAddress ? (
        <div className={Styles.containerCustomerDetails}>
          <p className={Styles.row}>Rua: {selectedAddress.street}</p>
          <p className={Styles.row}>Número: {selectedAddress.number}</p>
          <p className={Styles.row}>Bairro: {selectedAddress.beighborhood}</p>
          <p className={Styles.row}>Cidade: {selectedAddress.city}</p>
          <p className={Styles.row}>Complemento: {selectedAddress.aditional_data}</p>
        </div>
      ) : (
        addresses.map((address) => (
          <button key={address.id} 
          className={Styles.addressItem}
          onClick={() => setSelectedAddress(address)}>
            {address.street}, {address.number} - {address.beighborhood} - {address.aditional_data}</button>
        ))
      )}
      
    
    </main>
  );
}
