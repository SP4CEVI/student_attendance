import React, { useState, useEffect } from 'react';
import { getGroups } from '../../api/students';
import DateSelector from '../Student/DateSelector';
import './GroupSelector.css';

const GroupSelector = ({ onGroupChange, onDateChange }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getGroups();
        setGroups(data);
        if (data.length > 0) {
          setSelectedGroup(data[0].id);
          if (onGroupChange) {
            onGroupChange(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    setSelectedGroup(groupId);
    if (onGroupChange) {
      onGroupChange(groupId);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  return (
    <div className="selectors-container">
      <div className="group-selector">
        <label htmlFor="group">Выберите группу:</label>
        <select
          id="group"
          value={selectedGroup}
          onChange={handleGroupChange}
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
      <DateSelector onDateChange={handleDateChange} />
    </div>
  );
};

export default GroupSelector;