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
  const [employees, setEmployees] = useState([])
  const router = useRouter()

  const fetchData = async () => {
    const {data: allEmployees} = await api.get('/employees')//aqui estamos descontruindo o objeto JSON e renomenado o unico atributo chamado data para categories
    console.log("Todos os Funcionários:", allEmployees)
    setEmployees(allEmployees)
  }
  
  const addEmployee = async (employeeId) => {
    const newOrderEmployee = {
      order_id: orderId,
      employee_id: employeeId
    }

    await api.post('serviceordersemployees', newOrderEmployee)
    router.push(`/dashboard/scheduling/create/category?id=${orderId}`) 
    console.log(employeeId, orderId)
  }
  
  useEffect(() => {
    //Verifica se existem parâmetros disponíveis
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
          {employees.length > 0 ? (
            employees.map((employee) => (
            
                
                  <tr key={employee.id}>
                    <td>
                      <label className={Styles.row}>
                        Tipo: {employee.name}
                      </label>
                    </td>
                    <td>
                      <button className={Styles.categoryItem} onClick={() => addEmployee(employee.id)}>Adicionar</button>
                    </td>
                  </tr>
              
              
            ))
          ) : (
            <p className={Styles.row}>Funcionário não encontrados para esta OS.</p>
          )}
        </tbody>
       </table>
    </div>
  ); 
}
