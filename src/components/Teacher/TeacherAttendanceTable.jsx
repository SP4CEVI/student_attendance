import React, { useState, useEffect } from 'react';
import { getGroups, getGroupAttendance, getGroupStudents, getSubjects } from '../../api/attendance';
import GroupSelector from './GroupSelector';
import './TeacherAttendanceTable.css';

const TeacherAttendanceTable = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null); // Изначально пустое значение
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const groupsData = await getGroups();
        setGroups(groupsData);
      } catch (error) {
        console.error('Error loading groups:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsData = await getSubjects();
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error loading subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedGroup || !selectedDate) return;
      
      try {
        setLoading(true);
        const [studentsData, attendanceData] = await Promise.all([
          getGroupStudents(selectedGroup),
          getGroupAttendance(selectedGroup, selectedDate)
        ]);
        
        setStudents(studentsData);
        setAttendance(attendanceData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGroup, selectedDate]);

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getStudentPhone = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student?.phone || 'Нет данных';
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || subjectId;
  };

  const getUniqueSubjectIds = () => {
    const subjectIds = new Set();
    attendance.forEach(student => {
      student.subjects.forEach(subject => {
        subjectIds.add(subject.subjectId);
      });
    });
    return Array.from(subjectIds);
  };

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  if (!groups.length) {
    return <div className="no-data">Нет доступных групп</div>;
  }

  const uniqueSubjectIds = getUniqueSubjectIds();

  return (
    <div className="teacher-attendance-container">
      <GroupSelector 
        groups={groups}
        selectedGroup={selectedGroup}
        onGroupChange={handleGroupChange}
        date={selectedDate}
        onDateChange={handleDateChange}
      />
      
      {!selectedGroup || !selectedDate ? (
        <div className="no-data">
          Пожалуйста, выберите группу и дату для отображения посещаемости
        </div>
      ) : attendance.length === 0 ? (
        <div className="no-data">
          Нет данных о посещаемости для выбранной группы и даты
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="teacher-attendance-table">
            <thead>
              <tr>
                <th>№</th>
                <th>ФИО</th>
                <th>Телефон</th>
                {uniqueSubjectIds.map(subjectId => (
                  <th key={subjectId}>{getSubjectName(subjectId)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendance.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{getStudentPhone(student.studentId)}</td>
                  {uniqueSubjectIds.map(subjectId => {
                    const subjectAttendance = student.subjects.find(s => s.subjectId === subjectId);
                    return (
                      <td 
                        key={`${student.id}-${subjectId}`}
                        className={subjectAttendance?.attended ? 'present' : 'absent'}
                      >
                        {subjectAttendance?.attended ? 'Был' : 'Не был'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendanceTable;