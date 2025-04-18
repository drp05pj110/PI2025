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
  const [address, setAddress] = useState(null);
  const [order, setOrder] = useState(null);
  const [contact, setContact] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState({}); // Objeto para armazenar detalhes de todas as categorias
  const [products, setProducts] = useState([])
  const [productDetails, setProductDetails] = useState({}); // Objeto para armazenar detalhes de todos os Produtos
  const [employees, setEmployees] = useState([])
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
        console.log("Categorias retornadas:", categoriesResponse.data);
        setCategories(categoriesResponse.data);

        // Buscar detalhes de todas as categorias
        const categoryDetailsMap = {};
        for (const category of categoriesResponse.data) {
          try {
            const categoryDetailsResponse = await api.get(`/categorys/${category.category_id}`);
            categoryDetailsMap[category.category_id] = categoryDetailsResponse.data;
            console.log(`Detalhes da categoria ${category.category_id}:`, categoryDetailsResponse.data);
          } catch (err) {
            console.error(`Erro ao buscar detalhes da categoria ${category.category_id}:`, err);
          }
        }
        setCategoryDetails(categoryDetailsMap);

        //Buscar os produtos vinculados à OS
         const productsResponse = await api.get(`/serviceordersproducts/order/${orderId}`);
        console.log("Produtos retornados:", productsResponse.data);
        setProducts(productsResponse.data);

        // Buscar detalhes de todos os produtos
        const productsDetailsMap = {};
        for (const product of productsResponse.data) {
          try {
            const productDetailsResponse = await api.get(`/products/${product.product_id}`);
            productsDetailsMap[product.product_id] = productDetailsResponse.data;
            console.log(`Detalhes do produto ${product.product_id}:`, productDetailsResponse.data);
          } catch (err) {
            console.error(`Erro ao buscar detalhes do produto ${product.product_id}:`, err);
          }
        }
        setProductDetails(productsDetailsMap);

        //Buscar os Funcionários vinculados à OS
        const employeesResponse = await api.get(`/serviceordersemployees/order/${orderId}`);
        console.log("Funcionários retornados:", employeesResponse.data);
        setEmployees(employeesResponse.data);

        // Buscar detalhes de todos os funcionários
        const employeesDetailsMap = {};
        for (const employee of employeesResponse.data) {
          try {
            const employeeDetailsResponse = await api.get(`/employees/${employee.employee_id}`);
            employeesDetailsMap[employee.employee_id] = employeeDetailsResponse.data;
            console.log(`Detalhes do Funcionário ${employee.employee_id}:`, employeeDetailsResponse.data);
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

  async function handleCategoryDelete(categoryId) {
    try {
      const id = categoryId  
      await api.delete(`/serviceorderscategories/${id}`)
      setCategories((prevCategories) => 
        prevCategories.filter((category) => 
          category.id !== categoryId));

    } catch (err) {
      constole.log(err)
    }
    
  }

  async function handleProductDelete(productId) {
    try {
      const id = productId  
      await api.delete(`/serviceordersproducts/${id}`)
      setProducts((prevProducts) => 
        prevProducts.filter((product) => 
          product.id !== productId));

    } catch (err) {
      constole.log(err)
    }
    
  }

  async function handleEmployeeDelete(employeeId) {
    try {
      const id = employeeId  
      await api.delete(`/serviceordersemployees/${id}`)
      setEmployees((prevEmployees) => 
        prevEmployees.filter((employee) => 
          employee.id !== employeeId));

    } catch (err) {
      constole.log(err)
    }
    
  }

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return <p>Erro ao carregar os dados. Verifique e tente novamente.</p>;
  }

  const isButtonVisible = employees.length > 0 && categories.length > 0 && products.length > 0
  const isButtonEmployeeVisible = categories.length > 0 && products.length > 0 && (!isButtonVisible)

  return (
    <main className={Styles.container}>
      <div className={Styles.containerCustomerButtons}>
        <h1>Numero da OS {orderId}</h1> 
      </div>

      {order && customer && address ? (
        <div className={Styles.containerCustomerDetails}>
          <label className={Styles.row}>Situação da OS: {order.status}</label>
          <label className={Styles.row}>Data do Serviço: {formatDateForDisplay(order.execution_date)}</label>
          <label className={Styles.row}>Garantia: {order.validity} meses</label>
          <label className={Styles.row}>Horário para execução do serviço: {order.execution_time}</label>
          <label className={Styles.row}>Observações: {order.observations}</label>
          <label className={Styles.row}>Cliente: {customer.corporate_reason}</label>
          <label className={Styles.row}>Endereço: {address.street}, {address.number} - {address.beighborhood}</label>
          <label className={Styles.row}>Cidade: {address.city} - {address.state}</label>
          <label className={Styles.row}>CEP: {address.zip_code}</label>
          <label className={Styles.row}>Contato: {contact?.contact_name}</label>
        </div>
      ) : (
        <p>Dados não encontrados.</p>
      )}

      <div className={Styles.buttonContainer}>
        <Link href={
                  {
                     pathname: '/dashboard/scheduling/create/category/addcategory',
                     query: {
                      order_id: orderId
                    }, 
                  }
                } className={Styles.categoryItem}>Serviços</Link>
        {isButtonEmployeeVisible && (
            <Link href={
              {
                 pathname: '/dashboard/scheduling/create/category/addemployee',
                 query: {
                  order_id: orderId
                }, 
              }
            } className={Styles.categoryItem}>Funcionários</Link>
        )}

        {isButtonVisible && (
            <Link href={
                { 
                  pathname: '/dashboard/queries/order/actionorders', 
                  query: { id: orderId } 
                }
              } 
            className={Styles.categoryItem}>Avançar</Link>
      )}

        {message && <p className={Styles.message}>{message}</p>}
      </div>

      <div className={Styles.containerServices}> 

        <div>
          
            {categories.length > 0 ? (
            categories.map((category, index) => (
              <table key={index} className={Styles.containerCustomerDetails}>
                <tbody>
                  <tr>
                    <td>
                      <label className={Styles.row}>
                        Tipo: {categoryDetails[category.category_id]?.name || "Não encontrado"}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button className={Styles.categoryItem} onClick={()=>handleCategoryDelete(category.id)}>Excluir</button>
                    </td>
                    <td>
                      <Link href={
                      {
                        pathname: '/dashboard/scheduling/create/category/addproduct',
                        query: {
                          order_id: orderId,
                          category_id: category.category_id
                        }, 
                      }
                    }
                      className={Styles.categoryItem}>Produto</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            ))
          ) : (
            <p className={Styles.row}>Serviços não encontrados para esta OS.</p>
          )}
        </div>

        <div>
            {products.length > 0 ? (
            products.map((product, index) => (
              <table key={index} className={Styles.containerCustomerDetails}>
                <tbody>
                  <tr>
                    <td>
                      <label className={Styles.row}>
                        Produto: {productDetails[product.product_id]?.name || "Não encontrado"}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button className={Styles.categoryItem} onClick={()=>handleProductDelete(product.id)}>Excluir</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            ))
          ) : (
            <p className={Styles.row}>Produto não encontrados para esta OS.</p>
          )}
        </div>

        <div>
        {employees.length > 0 ? (
        employees.map((employee, index) => (
          <table key={index} className={Styles.containerCustomerDetails}>
            <tbody>
              <tr>
                <td>
                  <label className={Styles.row}>
                    Funcionário: {employeeDetails[employee.employee_id]?.name || "Não encontrado"}
                  </label>
                </td>
              </tr>
              <tr>
                <td>
                  <button className={Styles.categoryItem} onClick={()=>handleEmployeeDelete(employee.id)}>Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        ))
      ) : (
        <p className={Styles.row}>Funcionário não encontrados para esta OS.</p>
      )}
        </div>

      </div>
      
    </main>
  );
}