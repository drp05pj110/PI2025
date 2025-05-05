"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importação correta do componente Image
import logoImg from '../../../../../../public/logo.png'; // Importação da imagem
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

  useEffect(() => {
    document.body.classList.add(Styles.printMode);
    return () => {
      document.body.classList.remove(Styles.printMode);
    };
  }, []);
 
  const handleGeneratePDF = async () => {
    const order = orderId
    const element = document.getElementById("pdf-content");
    
    const canvas = await html2canvas(element, {
      scale: 2, // Aumenta a qualidade da imagem
      useCORS: true // Garante que imagens externas são carregadas corretamente
    })
  
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("landscape", "mm", "a4")
    
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width // Mantém proporção
  
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    //pdf.save(`certificado-${order}.pdf`)
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
      <button onClick={() => router.push(`/dashboard/prints/order/budget?id=${orderId}`)} className={Styles.printButton}>
        Orçamento
      </button>

      <button onClick={handleGeneratePDF} className={Styles.printButton}>
        Imprimir
      </button>

      <div id="pdf-content" className={Styles.marginContainer}>

      <div className={Styles.headerContainer}>
        <div className={Styles.logo}> {/* Uso correto do componente Image */}
          <Image
            alt="DRP05-PJI110"
            src={logoImg} // Usando a imagem importada
            width={80}
            height={80}
            priority={true}
            quality={100}
          /></div>

        <div className={Styles.containerHeaderDetails}>
          <h1>RELATÓRIO DE SERVIÇO PARA O CLIENTE</h1>
        </div>
      </div>
     
      {order && customer && address && (
          <div className={Styles.containerBodyDetails}>
            <p><strong>RAZÃO SOCIAL:</strong> {customer.fantasy_name}</p>
            <p><strong>ENDEREÇO:</strong> {address.street}, {address.number} - {address.beighborhood}, {address.city} - {address.state}</p>
            <p><strong>CNPJ:</strong> {customer.identification}</p>
            <p><strong>OS:</strong> {orderId} - Data: {formatDateForDisplay(order.execution_date)}</p>
            <p><strong>SERVIÇO EXECUTADO:</strong> 
            {categories.map((categories) => (
              <tr key={categories.id}>
                  <td>{categoryDetails[categories.category_id]?.name || "Não encontrado"}</td>
              </tr>
            ))}</p>
            <p><strong>Garantia:</strong> {order.validity} meses</p>
          </div>
        )}


        <div className={Styles.containerProductDetails}>

        <table>
          
            <tr>
              <th>Nome do Produto</th>
              <th>Troca/Permanente/Reparo</th>
              <th>Quantidade</th>
              <th>Descrição</th>
            </tr>
      
            {products.map((product) => (
              <tr key={product.id}>
                  <td>{productDetails[product.product_id]?.name || "Não encontrado"}</td>
                  <td>{productDetails[product.product_id]?.registry}</td>
                  <td>{productDetails[product.product_id]?.unity_of_mensure}</td>
                  <td>{productDetails[product.product_id]?.description}</td>
              </tr>
            ))}
        
        </table>

        </div>
   
        
        <div className={Styles.footerContainer}>
          <p><strong>Técnico responsável pelo Serviço</strong></p>
          <p><center>
              {employees.map((employee) => (
                <tr key={employee.id}>
                    <td>{employeeDetails[employee.employee_id]?.name || "Não encontrado"}</td>
                </tr>
            ))}
            </center>
          </p>
        </div>
      </div>

    </main>
  );
}