import React from 'react';
import Header from '../Header/Header';
import GroupSelector from './GroupSelector';
import TeacherAttendanceTable from './TeacherAttendanceTable';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  return (
    <div className="teacher-dashboard">
      <Header />
      <div className="content">
        <h2>Управление посещаемостью</h2>
        <GroupSelector />
        <TeacherAttendanceTable />
      </div>
    </div>
  );
};

export default TeacherDashboard;