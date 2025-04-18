"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importação correta do componente Image
import logoImg from '../../../../../public/logo.png'; // Importação da imagem
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [address, setAddress] = useState(null);
  const [order, setOrder] = useState(null);
  const [contact, setContact] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [employees, setEmployees] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [orderId, setOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const [contactByOrder, setContactByOrder] = useState(null);

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

        // Buscar categorias vinculadas à OS
        const categoriesResponse = await api.get(`/serviceorderscategories/order/${orderId}`);
        setCategories(categoriesResponse.data);

        // Buscar detalhes de todas as categorias
        const categoryDetailsMap = {};
        for (const category of categoriesResponse.data) {
          try {
            const categoryDetailsResponse = await api.get(`/categorys/${category.category_id}`);
            categoryDetailsMap[category.category_id] = categoryDetailsResponse.data;
          } catch (err) {
            console.error(`Erro ao buscar detalhes da categoria ${category.category_id}:`, err);
          }
        }
        setCategoryDetails(categoryDetailsMap);

        // Buscar os produtos vinculados à OS
        const productsResponse = await api.get(`/serviceordersproducts/order/${orderId}`);
        setProducts(productsResponse.data);

        // Buscar detalhes de todos os produtos
        const productsDetailsMap = {};
        for (const product of productsResponse.data) {
          try {
            const productDetailsResponse = await api.get(`/products/${product.product_id}`);
            productsDetailsMap[product.product_id] = productDetailsResponse.data;
          } catch (err) {
            console.error(`Erro ao buscar detalhes do produto ${product.product_id}:`, err);
          }
        }
        setProductDetails(productsDetailsMap);

        // Buscar os Funcionários vinculados à OS
        const employeesResponse = await api.get(`/serviceordersemployees/order/${orderId}`);
        setEmployees(employeesResponse.data);

        // Buscar detalhes de todos os funcionários
        const employeesDetailsMap = {};
        for (const employee of employeesResponse.data) {
          try {
            const employeeDetailsResponse = await api.get(`/employees/${employee.employee_id}`);
            employeesDetailsMap[employee.employee_id] = employeeDetailsResponse.data;
          } catch (err) {
            console.error(`Erro ao buscar detalhes do Funcionário ${employee.employee_id}:`, err);
          }
        }
        setEmployeeDetails(employeesDetailsMap);

        // Buscar dados do cliente
        const customerResponse = await api.get(`/customers/${orderResponse.data.customer_id}`);
        setCustomer(customerResponse.data);

        // Buscar endereço
        const addressResponse = await api.get(`/addresses/${orderResponse.data.address_id}`);
        setAddress(addressResponse.data);

        // Buscar contato vinculado à OS
        const contactByOrderResponse = await api.get(`/serviceorderscontacts/order/${orderResponse.data.id}`);
        const contactObject = contactByOrderResponse.data?.[0] || null;
        setContactByOrder(contactObject);

        if (contactObject) {
          const contactDataResponse = await api.get(`/contacts/${contactObject.contact_id}`);
          setContact(contactDataResponse.data);
        } else {
          setContact(null);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

// Função para imprimir a tela
const handlePrint = () => {
 // window.print();
 console.log(Window)
}

const handleGeneratePDF = async () => {
  handlePrint()
  const order = orderId
  const element = document.getElementById("pdf-content");
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  //pdf.save(`ordem_servico${order}.pdf`);
  window.open(pdf.output('bloburl'), '_blank')
}

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return <p>Erro ao carregar os dados. Verifique e tente novamente.</p>;
  }

  return (
    <main className={Styles.container}>

      {/* Botão de impressão */}
      <button onClick={() => router.push(`/dashboard/prints/order/certify?id=${orderId}`)} className={Styles.printButton}>
        Gerar Certificado
      </button>

      <button onClick={handleGeneratePDF} className={Styles.printButton}>
        Imprimir
      </button>

      <div id="pdf-content" className={Styles.marginContainer}>

      <div className={Styles.headerContainer}>
        <div className={Styles.logo}> {/* Uso correto do componente Image */}
          <Image
            alt="Sakai Controll"
            src={logoImg} // Usando a imagem importada
            objectPosition={'center'}
            width={120}
            height={120}
          /></div>

        <div className={Styles.containerHeaderDetails}>
          <h1>Sakai Controle de Pragas</h1>
          <h2>Whatsapp: (15) 99788-6338</h2>
        </div>
      </div>
     
      {order && customer && address ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}>Cliente: {customer.fantasy_name}</label>
          <label className={Styles.row}>Endereço: {address.street}, {address.number} - {address.beighborhood} - {address.aditional_data}</label>
          <label className={Styles.row}>Cidade: {address.city} - {address.state} - CEP: {address.zip_code}</label>
          <label className={Styles.row}>Ordem de serviço: {orderId} - Data do Serviço: {formatDateForDisplay(order.execution_date)}</label>
          <label className={Styles.row}>Horário para execução do serviço: {order.execution_time}</label>
          <label className={Styles.row}>Garantia: <strong>{order.validity} meses</strong></label>
        </div>
      ) : (
        <p>Dados não encontrados.</p>
      )}

      <div className={Styles.buttonContainer}>
        <table>
          <thead>
            <tr>
              <th>Contato(s):</th>
              <th>{contact?.type}:</th>
              <th>Serviço(s):</th>
              <th>Funcionário(s):</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{contact?.contact_name}</td>
              <td>{contact?.contact_information}</td>
              <td>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id}>
                      {categoryDetails[category.category_id]?.name || "Não encontrado"}
                    </div>
                  ))
                ) : (
                  <div>Serviços não encontrados para esta OS.</div>
                )}
              </td>
              <td>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <div key={employee.id}>
                      {employeeDetails[employee.employee_id]?.name || "Não encontrado"}
                    </div>
                  ))
                ) : (
                  <div>Funcionário não encontrados para esta OS.</div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={Styles.buttonContainer}>
        <table>
          <thead>
            <tr>
              <th>Alvo</th>
              <th>Produto(s)</th>
              <th>Registro</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{productDetails[product.product_id]?.description}</td>
                  <td>{productDetails[product.product_id]?.name || "Não encontrado"}</td>
                  <td>{productDetails[product.product_id]?.registry}</td>
                  <td>{productDetails[product.product_id]?.unity_of_mensure}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Produto não encontrados para esta OS.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={Styles.buttonContainer}>
        <table>
          <tbody>
            <tr> 
                    <td>Periodo de afastamentos: 2 horas</td>
            </tr>
            <tr> 
                  
                    <td>Ação Toxicológica: Disque Intoxicação Nacional: 0800 722 6001</td>
                  
            </tr>
            <tr>  
                    <td><label className={Styles.row}>Observações: {order.observations}</label></td>
            </tr>
          </tbody>  
        </table>    

        <table>
          <thead>
           
            <tr>
              <td>Luciano Barbosa Sakai</td>
              <td>
                Recebi o Comprovante de execução do serviço e orientações pertinentes ao serviço executado.
              </td> 
            </tr>
            <tr>
              <td>Técnico Responsável</td>
              <td>Nome:</td> 
            </tr>
            <tr>
              <td>CRQ: 04165650</td>
              <td>RG:</td> 
            </tr>
          </thead>
        </table>
      </div>

      </div>
     

    </main>
  );
}