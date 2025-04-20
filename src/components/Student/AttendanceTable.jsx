import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getStudentAttendance, updateStudentAttendance, getGroupAttendance } from '../../api/attendance';
import Button from '../Shared/Button';
import './AttendanceTable.css';

const AttendanceTable = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        // Для студента получаем только его посещаемость
        if (user.role === 'student') {
          const data = await getStudentAttendance(user.id, date);
          setAttendance(data);
        }
        // Для преподавателя получаем данные всей группы
        else if (user.role === 'teacher') {
          const data = await getGroupAttendance(user.groupId, date);
          setAttendance(data);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user, date]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const toggleAttendance = (studentId, subjectId) => {
    setAttendance(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedSubjects = student.subjects.map(subj => 
          subj.subjectId === subjectId 
            ? { ...subj, attended: !subj.attended } 
            : subj
        );
        return { ...student, subjects: updatedSubjects };
      }
      return student;
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateStudentAttendance(user.id, date, attendance);
      alert('Посещаемость успешно сохранена');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Ошибка при сохранении посещаемости');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div className="attendance-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Телефон</th>
            {attendance.map((item) => (
              <th key={item.subjectId}>{item.subjectName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{user.name}</td>
            <td>{user.phone || 'Не указан'}</td>
            {attendance.map((item) => (
              <td key={item.subjectId}>
                <button
                  className={`attendance-button ${item.attended ? 'present' : 'absent'}`}
                  onClick={() => toggleAttendance(item.subjectId)}
                >
                  {item.attended ? 'Был' : 'Не был'}
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      
      <div className="save-button-container">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </div>
  );
};

export default AttendanceTable;