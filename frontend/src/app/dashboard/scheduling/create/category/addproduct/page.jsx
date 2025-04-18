"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Styles from "./Styles.module.css";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';



export default function OrdersDetails() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [products, setProducts] = useState([])
  const router = useRouter()

  const fetchData = async () => {
    const {data: allProductsByCategory} = await api.get(`/products/category/${categoryId}`)//aqui estamos descontruindo o objeto JSON e renomenado o unico atributo chamado data para categories
    console.log("Toda os produtos da categoria:", allProductsByCategory)
    setProducts(allProductsByCategory)
  }
  
  const addProduct = async (productId) => {
    const newOrderProduct = {
      order_id: orderId,
      product_id: productId
    }

    const productResponse = await api.post('serviceordersproducts', newOrderProduct)
    router.push(`/dashboard/scheduling/create/category?id=${orderId}`) 
    console.log(categoryId, orderId)
  }
  
  useEffect(() => {
    //Verifica se existem parâmetros disponíveis
    const orderId = searchParams.get("order_id")
    const categoryId = searchParams.get("category_id")

    if (!orderId || !categoryId) {
      setError(true);
      setLoading(false);
      return;
    }
    setOrderId(orderId);
    setCategoryId(categoryId)
   
    
  }, [searchParams]);

  useEffect (() => {
    //chama chama o datafetch apenas se o categoryId estiver disponível
    if(categoryId){
      try {
        fetchData();
      } catch (error) {
        console.log('teste', error)
      } finally {
        setLoading(false)
      }
    }
  }, [categoryId]);

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return <p>Erro ao carregar os dados. Verifique e tente novamente.</p>;
  }
  
  return (
    <div>
       <table className={Styles.containerCustomerDetails}>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
            
                
                  <tr key={product.id}>
                    <td>
                      <label className={Styles.row}>
                        Tipo: {product.name} 
                      </label>
                    </td>
                    <td>
                      <button className={Styles.categoryItem} onClick={() => addProduct(product.id)}>Adicionar</button>
                    </td>
                  </tr>
              
              
            ))
          ) : (
            <p className={Styles.row}>Produto não encontrados para esta OS.</p>
          )}
        </tbody>
       </table>
    </div>
  ); 
}
