import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getGroupStudents, getGroupAttendance, updateAttendance, getSubjects } from '../../api/attendance';
import Button from '../Shared/Button';
import DateSelector from './DateSelector';
import './AttendanceTable.css';
import { getDay, parseISO } from 'date-fns';

const AttendanceTable = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [saving, setSaving] = useState(false);

  const isSunday = selectedDate && getDay(parseISO(selectedDate)) === 0;

  useEffect(() => {
    if (!selectedDate) return;
  
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [studentsData, subjectsData] = await Promise.all([
          getGroupStudents(user.groupId),
          getSubjects()
        ]);
        
        setStudents(studentsData);
        setSubjects(subjectsData);

        const attendanceData = await getGroupAttendance(user.groupId, selectedDate);
        
        if (attendanceData.length === 0) {
          const initialAttendance = studentsData.map(student => ({
            studentId: student.id,
            name: student.name,
            date: selectedDate,
            groupId: user.groupId,
            subjects: subjectsData.map(subject => ({
              subjectId: subject.id,
              subjectName: subject.name,
              attended: false
            }))
          }));
          setAttendance(initialAttendance);
        } else {
          const formattedAttendance = attendanceData.map(record => ({
            studentId: record.studentId,
            name: record.name,
            date: record.date,
            groupId: record.groupId,
            subjects: subjectsData.map(subject => ({
              subjectId: subject.id,
              subjectName: subject.name,
              attended: record.subjects.find(subj => subj.subjectId === subject.id)?.attended || false
            }))
          }));
          setAttendance(formattedAttendance);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [user.groupId, selectedDate]);
  

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const toggleAttendance = (studentId, subjectId) => {
    setAttendance(prev => prev.map(record => {
      if (record.studentId === studentId) {
        return {
          ...record,
          subjects: record.subjects.map(subj => 
            subj.subjectId === subjectId 
              ? { ...subj, attended: !subj.attended }
              : subj
          )
        };
      }
      return record;
    }));
  };

  const handleSave = async () => {
    if (!selectedDate) {
      alert('Пожалуйста, выберите дату');
      return;
    }

    try {
      setSaving(true);
      
      const dataToSave = attendance.map(record => ({
        ...record,
        date: selectedDate,
        subjects: record.subjects.map(subj => ({
          subjectId: subj.subjectId,
          attended: subj.attended
        }))
      }));
      
      await updateAttendance(dataToSave);
      alert(`Посещаемость за ${selectedDate} успешно сохранена!`);
      
      const updatedData = await getGroupAttendance(user.groupId, selectedDate);
      setAttendance(updatedData);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Ошибка при сохранении: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!selectedDate) {
    return (
      <div className="attendance-container">
        <h2>Посещаемость группы {user.groupId}</h2>
        <DateSelector date={selectedDate} onDateChange={handleDateChange} />
        <div className="no-date-selected">
          Пожалуйста, выберите дату для отображения посещаемости
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="attendance-container">
        <h2>Посещаемость группы {user.groupId}</h2>
        <DateSelector date={selectedDate} onDateChange={handleDateChange} />
        <div className="loading">Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className="attendance-container">
      <h2>Посещаемость группы {user.groupId}</h2>
      <DateSelector date={selectedDate} onDateChange={handleDateChange} />
      
      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th rowSpan="2">№</th>
              <th rowSpan="2">ФИО</th>
              <th rowSpan="2">Телефон</th>
              <th colSpan={subjects.length}>Предметы</th>
            </tr>
            <tr>
              {subjects.map(subject => (
                <th key={subject.id}>{subject.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const studentAttendance = attendance.find(a => a.studentId === student.id);
              
              if (!studentAttendance) return null;
              
              return (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.phone || '-'}</td>
                  {subjects.map(subject => {
                    const subjectData = studentAttendance.subjects.find(s => s.subjectId === subject.id);
                    const attended = subjectData?.attended || false;
                    
                    return (
                      <td key={`${student.id}-${subject.id}`}>
                        <button
                          className={`attendance-toggle ${attended ? 'present' : 'absent'}`}
                          onClick={() => toggleAttendance(student.id, subject.id)}
                        >
                          {attended ? '✓' : '✕'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="actions">
        <Button 
          onClick={handleSave} 
          disabled={saving || isSunday}
          title={isSunday ? "Сохранение посещаемости недоступно в воскресенье" : ""}
        >
          {saving ? 'Сохранение...' : 'Сохранить посещаемость'}
        </Button>
        {isSunday && (
          <div className="warning-message">
            В воскресенье занятия не проводятся, сохранение недоступно
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTable;