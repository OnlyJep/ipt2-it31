import React from 'react';
import { Card, Avatar, Col, Row, Descriptions } from 'antd';

// Example teacher profile data (this could come from an API in a real app)
const teacherData = {
  name: 'Dr. John Doe',
  department: 'Computer Science',
  position: 'Professor',
  contact: 'john.doe@university.edu',
  courses: ['CS101', 'CS102', 'CS201'],
  imageUrl: 'https://i.pravatar.cc/150?img=3', // Placeholder image
};

const TeacherProfile = () => {
  return (
    <Card title="Teacher Profile" style={{ marginBottom: 24 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Avatar src={teacherData.imageUrl} size={120} />
        </Col>
        <Col span={18}>
          <Descriptions title={teacherData.name} bordered>
            <Descriptions.Item label="Department">{teacherData.department}</Descriptions.Item>
            <Descriptions.Item label="Position">{teacherData.position}</Descriptions.Item>
            <Descriptions.Item label="Contact">{teacherData.contact}</Descriptions.Item>
            <Descriptions.Item label="Courses">{teacherData.courses.join(', ')}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default TeacherProfile;
