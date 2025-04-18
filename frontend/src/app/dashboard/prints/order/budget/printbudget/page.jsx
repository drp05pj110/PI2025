"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importação correta do componente Image
import logoImg from '../../../../../../../public/logo.png'; // Importação da imagem
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
  const [categories, setCategories] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [orderId, setOrderId] = useState(null);
  const [budget, setBudget] = useState(null);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const orderId = searchParams.get("id")
    const budgetId = searchParams.get('budget_id')

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

        //Buscar detalhes do Orçamento
        const responseBudget = await api.get(`/budget/${budgetId}`)
        setBudget(responseBudget.data)

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

        // Buscar dados do cliente
        const customerResponse = await api.get(`/customers/${orderResponse.data.customer_id}`);
        setCustomer(customerResponse.data);

        // Buscar endereço
        const addressResponse = await api.get(`/addresses/${orderResponse.data.address_id}`);
        setAddress(addressResponse.data);

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
//  window.print();
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
  //pdf.save(`orcamento${order}.pdf`);
  window.open(pdf.output('bloburl'), '_blank')
};


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
        Retornar
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
            width={80}
            height={80}
            priority={true}
            quality={100}
          /></div>

        <div className={Styles.containerHeaderDetails}>
          <h1>Sakai Controle de Pragas</h1>
          <h3>Telefone: (11) 44612658 Whatsapp: (15) 99788-6338</h3>
        </div>
      </div>
     
      {order && customer && address && (
          <div className={Styles.containerBodyDetails}>
            <p>Senhor(a),</p>
            <p>Conforme solicitado, segue a proposta para realização do(s):</p>
            <p>
            <div className={Styles.containerCategoryDetails}>

                <table>
                  
                    <tr>
                      <th>Serviço(s) de:</th>
                    </tr>
              
                    {categories.map((category) => (
                      <tr key={category.id}>
                          <td>{categoryDetails[category.category_id]?.name || "Não encontrado"}</td>
                      </tr>
                    ))}
                
                </table>

            </div>
            </p>
            <p>No valor de R$ {budget.cash}.</p>
            <p>O(s) Serviço(s) serão realizados para <strong>{customer.fantasy_name}</strong> , CNPJ nº <strong>{customer.identification}</strong> 
            , no endereço: <strong>{address.street}, {address.number} - {address.beighborhood}, {address.city} - {address.state}</strong>.
            </p>
            <p>
             Essa proposta tem validade de {budget.validity} mês(es) a partir de  {formatDateForDisplay(order.execution_date)}.
            </p>
            

          
          </div>
        )}


        <div className={Styles.containerProductDetails}>

        <table>
          
            <tr>
              <th>Nome do Produto</th>
              <th>Inscrição MS/MA</th>
              <th>Diluição Recomendada</th>
              <th>Alvo</th>
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
          <p><strong>Atenciosamente,</strong></p>
          <p>Sakai Controle de Pragas</p>
        </div>
      </div>

    </main>
  );
}