// src/app/dashboard/scheduling/page.jsx
"use client"; // Necessário para usar hooks como useRouter em componentes no App Router

import React from "react";
import Calendar from "@/app/dashboard/components/Calendar/page"
import { useRouter } from "next/navigation";
import Styles from './Styles.module.css'

const Ordem = () => {
  const router = useRouter();

  const handleDateClick = (info) => {
    router.push(`/dashboard/scheduling/create?date=${info.dateStr}`);
  };

  return (
    <div>
      <h1 className={Styles.h1}>Agendamento de Serviços</h1>
      <Calendar onDateClick={handleDateClick} />
    </div>
  );
};

export default Ordem;