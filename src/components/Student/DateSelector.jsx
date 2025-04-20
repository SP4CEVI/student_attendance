import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import './DateSelector.css';

const DateSelector = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const formattedDate = format(parseISO(selectedDate), 'EEEE, d MMMM yyyy', { locale: ru });

  return (
    <div className="date-selector">
      <label htmlFor="date">Выберите дату:</label>
      <input
        type="date"
        id="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <div className="selected-date">{formattedDate}</div>
    </div>
  );
};

export default DateSelector;