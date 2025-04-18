// components/Calendar.js
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


const Calendar = ({ onDateClick }) => {
  return (
    <div className='full-calendar-container'>
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth" // Exibe o calendário mensal inicialmente
      selectable={true} // Permite selecionar datas
      dateClick={(info) => onDateClick(info)} // Detecta o clique em uma data
      events={[]} // Eventos a serem exibidos no calendário
    />
    </div>
  );
};

export default Calendar;
