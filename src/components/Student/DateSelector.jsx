import React from 'react';
import { format, parseISO, isValid, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import './DateSelector.css';

const DateSelector = ({ date, onDateChange }) => {
  const handleChange = (e) => { /*Вызывается при изменении значения поля ввода <input type="date">*/
    const selectedDate = e.target.value;
    if (onDateChange && typeof onDateChange === 'function') {
      onDateChange(selectedDate);
    }
  };

  const formattedDate = date && isValid(parseISO(date)) /* существует и является корректной дата?*/
    ? format(parseISO(date), 'EEEE, d MMMM yyyy', { locale: ru })
    : 'Дата не выбрана';

  return (
    <div className="date-selector">
      <label htmlFor="date">Выберите дату:</label>
      <input /* Поле ввода даты */
        type="date"
        id="date"
        value={date || ''}
        onChange={handleChange}
        max={new Date().toISOString().split('T')[0]}    /*Устанавливает максимальную дату, которую можно выбрать (текущую) */
      />
      <div className="selected-date">{formattedDate}</div>
    </div>
  );
};

export default DateSelector;
