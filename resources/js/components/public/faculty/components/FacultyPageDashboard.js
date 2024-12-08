import React from 'react';
import { Layout, Row, Col, Spin, Empty } from 'antd';
import FacultyProfile from './FacultyProfile';
import DepartmentManagement from './DepartmentManagement';
import FacultyTimetable from './FacultyTimetable';
import FacultyPerformance from './FacultyPerformance';
import { LoadingOutlined } from '@ant-design/icons';

const { Content } = Layout;

const FacultyPageDashboard = ({ facultyMembers, timetableEvents, performanceData, onAssignCourse }) => {
    const isLoading = !facultyMembers || !timetableEvents || !performanceData;

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin indicator={<LoadingOutlined spin />} />
                <p>Loading Faculty Data...</p>
            </div>
        );
    }

    if (facultyMembers.length === 0) {
        return <Empty description="No faculty members found" />;
    }

    return (
        <Content style={{ padding: '24px', minHeight: '100vh' }}>
            {/* Faculty Section */}
            <Row gutter={16}>
                <Col xs={24} sm={12} md={8}>
                    <FacultyProfile facultyMembers={facultyMembers} />
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <DepartmentManagement facultyMembers={facultyMembers} onAssignCourse={onAssignCourse} />
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <FacultyTimetable events={timetableEvents} />
                </Col>
            </Row>

            {/* Performance Section */}
            <Row gutter={16} style={{ marginTop: 20 }}>
                <Col span={24}>
                    <FacultyPerformance performanceData={performanceData} />
                </Col>
            </Row>
        </Content>
    );
};

export default FacultyPageDashboard;
