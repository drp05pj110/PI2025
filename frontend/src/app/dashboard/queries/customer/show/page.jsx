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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); // Adicionado estado de carregamento
  const router = useRouter()

  useEffect(() => {
    const id = searchParams.get("id"); // Obtém o valor de `id` da URL

    if (!id) {
      setError(true);
      setLoading(false); // Encerra o carregamento
      return;
    }

    // Função para buscar os dados do cliente e endereços
    async function fetchData() {
      try {
        // Busca dados do cliente
        const customerResponse = await api.get(`/customers/${id}`);
        setCustomer(customerResponse.data);

        // Busca dados de endereços
        const addressResponse = await api.get(`/addresses/customer/${id}`);
        setAddresses(addressResponse.data || []); // Garante que addresses seja um array

        const contactResponse = await api.get(`/contacts/customer/${id}`);
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
  async function handleContactDelete(contactId) {
    try {
      const id = contactId  
      await api.delete(`/contacts/${id}`)
      setContacts((prevContacts) => 
        prevContacts.filter((contact) => 
          contact.id !== contactId));

    } catch (err) {
      constole.log(err)
    }
    
  }
  async function handleAddressDelete(addressId) {
    try {
      const id = addressId  
      await api.delete(`/addresses/${id}`)
      setAddresses((prevAddresses) => 
        prevAddresses.filter((address) => 
          address.id !== addressId));

    } catch (err) {
      constole.log(err)
    }
    
  }
  async function handleCustomerDelete(customerId) {
    try {
      if (contacts.length === 0 && addresses.length === 0){
        const id = customerId  
        await api.delete(`/customers/${id}`)
        
         // Redireciona após sucesso
       router.push(`/dashboard/queries/customer`)
      }
     
      

    } catch (err) {
      constole.log(err)
    }
    
  }

  return (
    <main className={Styles.container}>
      <div className={Styles.containerCustomerButtons}>
        <h1>Cliente</h1>
        <Link href={'/dashboard/registrations/customer'}
        className={Styles.button}> Cadastrar outro Cliente</Link>
      </div>
     
      {/* Dados do Cliente */}
      {customer ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}> {customer.identification_type}</label>
          <label className={Styles.row}>Razão Social: {customer.corporate_reason}</label>
          <label className={Styles.row}>Nome fantasia: {customer.fantasy_name}</label>
          <p className={Styles.row}>CNPJ/CPF: {customer.identification}</p>
        <div className={Styles.containerCustomerButtons}>
          <Link className={Styles.addressItem}
            href={{
                 pathname: '/dashboard/queries/customer/show/contacts',
                 query: {id: customer.id},
                 }}>
            Novo contato
          </Link>
          <Link className={Styles.addressItem}
            href={{pathname: '/dashboard/queries/customer/show/addresses',
              query: {id: customer.id},
              }}>
            Novo endereço
          </Link>
          {contacts.length === 0 && addresses.length === 0 && (
              <button className={Styles.addressItem} onClick={
                () => handleCustomerDelete(customer.id)}>
                  Excluir
              </button>
            )}
          <Link className={Styles.addressItem}
            href={{pathname: '/dashboard/queries/customer/edit',
              query: {id: customer.id},
              }}>
            Atualizar
          </Link>
        </div>
        </div>
      ) : (
        <p>Cliente não encontrado.</p>
      )}
      
      <div className={Styles.ContainerInformations}>
         <div>

         <h2>Contatos</h2>

            {/* Dados de Contatos */}
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <table key={index} className={Styles.containerCustomerDetails}>
                  <tr>

                      <td className={Styles.tdAddress}>
                        <label className={Styles.row}>Nome: {contact.contact_name}</label>
                      </td>
                      <td>
                        <label className={Styles.row}>Tipo:  {contact.type}</label>
                      </td>

                  </tr>
                  <tr>
                    <p className={Styles.row}>Contato: {contact.contact_information}</p>
                  </tr>
                  <tr className={Styles.buttonAddress}>
                    <td>
                    <button className={Styles.addressItem} onClick={()=>handleContactDelete(contact.id)} >
                        Excluir
                    </button>
                    </td>
                  </tr>
                </table>
              ))
            ) : (
              <p className={Styles.row}>Contatos não encontrados para este cliente.</p>
         )}

          </div>
          
          <div>

          <h2>Endereços</h2>

               {/* Dados de Endereços */}
      
              {addresses.length > 0 ? (
                addresses.map((address, index) => (
                  <table key={index} className={Styles.containerCustomerDetails}>
                    <tr>
                      <td className={Styles.tdAddress}>
                        <label className={Styles.row}>Logradouro: {address.street}</label>
                      </td>
                      <td>
                        <label className={Styles.row}>Numero:  {address.number}</label>
                      </td>
                    </tr>
                    <tr>
                      <p className={Styles.row}>Bairro: {address.neighborhood || address.beighborhood}</p>
                    </tr>
                    <tr className={Styles.buttonAddress}>
                    <button className={Styles.addressItem} onClick={()=>handleAddressDelete(address.id)} >
                          Excluir
                      </button>
                    </tr>
                  </table>
                ))
              ) : (
                <p className={Styles.row}>Endereços não encontrados para este cliente.</p>
              )}

       </div>       

      </div>
       
    </main>
  );
}