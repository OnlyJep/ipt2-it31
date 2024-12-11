import React from 'react';
import { Tabs } from 'antd';
import { CalendarOutlined, ReadOutlined } from '@ant-design/icons'; 
import SemestralPeriodsPage from './components/semestralperiod/SemestralPeriodPage.js'; 
import AcademicYearPage from './components/academicyear/AcademicYearPage';
import MainDashboard from '../../dashboard/components/MainDashboard.js';

const { TabPane } = Tabs;

const TermsManagementPage = () => {
  return (
    <MainDashboard>
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        <h1>Terms Management</h1>

        {}
        <div style={{
          borderBottom: '2px solid #1890ff', 
          width: '10%', 
          marginBottom: '20px'
        }} />

        <Tabs defaultActiveKey="1" type="card">
          <TabPane 
            tab={<><CalendarOutlined style={{ marginRight: '8px' }} />Semestral Periods</>} 
            key="1"
          >
            <SemestralPeriodsPage />
          </TabPane>

          <TabPane 
            tab={<><ReadOutlined style={{ marginRight: '8px' }} />Academic Year</>} 
            key="2"
          >
            <AcademicYearPage />
          </TabPane>
        </Tabs>
      </div>
    </MainDashboard>
  );
};

export default TermsManagementPage;
