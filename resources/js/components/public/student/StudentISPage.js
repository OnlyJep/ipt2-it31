// StudentISPage.js
import React from 'react';
import { Layout } from 'antd';
import MainDashboard from '../dashboard/components/MainDashboard';  // Assuming MainDashboard component exists
import StudentISPageDashboard from './components/StudentISPageDashboard';  // Import the dashboard

const { Content } = Layout;

const StudentISPage = () => {
  return (
    <MainDashboard>
      <StudentISPageDashboard />
    </MainDashboard>
  );
};

export default StudentISPage;
