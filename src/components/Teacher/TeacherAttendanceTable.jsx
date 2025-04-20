import React, { useState, useEffect } from 'react';
import { getGroupAttendance } from '../../api/attendance';
import GroupSelector from './GroupSelector';
import './TeacherAttendanceTable.css';

const TeacherAttendanceTable = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!group) return;
      
      try {
        setLoading(true);
        const data = await getGroupAttendance(group, date);
        setAttendance(data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [group, date]);

  const handleGroupChange = (groupId) => {
    setGroup(groupId);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  if (loading && group) {
    return <div>Загрузка данных...</div>;
  }

  if (!attendance.length && group) {
    return <div>Нет данных о посещаемости для выбранной группы и даты</div>;
  }

  const subjects = attendance.length > 0 ? attendance[0].subjects : [];

  return (
    <div className="teacher-attendance-container">
      <GroupSelector onGroupChange={handleGroupChange} onDateChange={handleDateChange} />
      
      <table className="teacher-attendance-table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Телефон</th>
            {subjects.map((subject) => (
              <th key={subject.id}>{subject.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attendance.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.phone || 'Не указан'}</td>
              {student.subjects.map((subject) => (
                <td key={subject.id} className={subject.attended ? 'present' : 'absent'}>
                  {subject.attended ? 'Был' : 'Не был'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherAttendanceTable;