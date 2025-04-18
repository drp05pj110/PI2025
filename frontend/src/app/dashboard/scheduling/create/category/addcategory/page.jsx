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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [categories, setCategories] = useState([])
  const router = useRouter()

  const fetchData = async () => {
    const {data: allCategories} = await api.get('/categorys')//aqui estamos descontruindo o objeto JSON e renomenado o unico atributo chamado data para categories
    console.log("Toda as categorias:", allCategories)
    setCategories(allCategories)
  }
  
  const addCategory = async (categoryId) => {
    const newOrderCategorie = {
      order_id: orderId,
      category_id: categoryId
    }

    const categoryResponse = await api.post('serviceorderscategories', newOrderCategorie)
    router.push(`/dashboard/scheduling/create/category?id=${orderId}`) 
    console.log(categoryId, orderId)
  }
  
  useEffect(() => {
    const orderId = searchParams.get("order_id")

    if (!orderId) {
      setError(true);
      setLoading(false);
      return;
    }
    setOrderId(orderId);
   
    try {
      fetchData();
    } catch (error) {
      console.log('teste', error)
    } finally {
      setLoading(false)
    }
    
  }, [searchParams]);

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
          {categories.length > 0 ? (
            categories.map((category) => (
            
                
                  <tr key={category.id}>
                    <td>
                      <label className={Styles.row}>
                        Tipo: {category.name}
                      </label>
                    </td>
                    <td>
                      <button className={Styles.categoryItem} onClick={() => addCategory(category.id)}>Adicionar</button>
                    </td>
                  </tr>
              
              
            ))
          ) : (
            <p className={Styles.row}>Serviços não encontrados para esta OS.</p>
          )}
        </tbody>
       </table>
    </div>
  ); 
}
