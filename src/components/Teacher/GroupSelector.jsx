import React from 'react';
import DateSelector from '../Student/DateSelector';
import './GroupSelector.css';

const GroupSelector = ({ groups, selectedGroup, onGroupChange, date, onDateChange }) => {
  return (
    <div className="group-selector-container">
      <div className="group-selector">
        <label htmlFor="group-select">Выберите группу:</label>
        <select
          id="group-select"
          value={selectedGroup || ''}
          onChange={(e) => onGroupChange(e.target.value || null)}
          disabled={!groups.length}
        >
          <option value="" disabled>Выберите группу</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
      <DateSelector date={date} onDateChange={onDateChange} />
    </div>
  );
};

export default GroupSelector;