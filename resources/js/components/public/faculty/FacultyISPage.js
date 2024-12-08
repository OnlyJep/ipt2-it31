import React from 'react';
import { Layout, Row, Col } from 'antd';
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard
import TeacherProfile from './components/TeacherProfile';  // Teacher Profile Component
import TeacherAssignments from './components/TeacherAssignments';  // Teacher Assignments Component
import TeacherTimetable from './components/TeacherTimetable';  // Teacher Timetable Component

const { Content } = Layout;

const FacultyInformation = () => {
  return (
    <Content style={{ padding: '24px', minHeight: 280 }}>
      <h1>Faculty Information System</h1>

      <Row gutter={24}>
        <Col span={8}>
          <TeacherProfile />
        </Col>
        <Col span={8}>
          <TeacherAssignments />
        </Col>
        <Col span={8}>
          <TeacherTimetable />
        </Col>
      </Row>
    </Content>
  );
};

const FacultyPage = () => {
  return (
    <MainDashboard>
      <FacultyInformation />
    </MainDashboard>
  );
};

export default FacultyPage;
