import React from 'react';
import Header from '../Header/Header';
import DateSelector from './DateSelector';
import AttendanceTable from './AttendanceTable';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <Header />
      <div className="content">
        <AttendanceTable />
      </div>
    </div>
  );
};

export default StudentDashboard;