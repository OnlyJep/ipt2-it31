import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Tabs, Table, Tag, Space, Button, Input, Spin, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons'; // Import the search icon

const { Content } = Layout;
const { TabPane } = Tabs;

const StudentISPageDashboard = () => {
  // Available courses (for enrollment)
  const availableCourses = [
    { courseID: 'CSE101', courseName: 'Introduction to Computer Science' },
    { courseID: 'CSE102', courseName: 'Data Structures and Algorithms' },
    { courseID: 'MATH101', courseName: 'Calculus I' },
  ];

  // State for student data (with enrollment tracking)
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState('1');

  // Fetch student data (mock data or API)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Simulating API data fetch
      setStudents([
        {
          key: '1',
          name: 'John Doe',
          studentID: '12345',
          dob: '2000-01-01',
          email: 'johndoe@email.com',
          phone: '+1234567890',
          address: '123 Main Street, Anytown, USA',
          enrollments: [
            { courseID: 'CSE101', courseName: 'Introduction to Computer Science', status: 'Completed', startDate: '2023-08-01', endDate: '2023-12-01' }
          ],
        },
        {
          key: '2',
          name: 'Jane Smith',
          studentID: '67890',
          dob: '2001-02-15',
          email: 'janesmith@email.com',
          phone: '+9876543210',
          address: '456 Elm Street, Anytown, USA',
          enrollments: [
            { courseID: 'MATH101', courseName: 'Calculus I', status: 'Ongoing', startDate: '2023-09-01', endDate: '2024-01-01' }
          ],
        }
      ]);
      setLoading(false);
    }, 1500); // Simulate API delay
  }, []);

  // Filtered students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.studentID.includes(searchQuery)
  );

  // Table columns for displaying students
  const studentColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Student ID',
      dataIndex: 'studentID',
      key: 'studentID',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Enrolled Courses',
      dataIndex: 'enrollments',
      key: 'enrollments',
      render: (enrollments) => (
        <div>
          {enrollments.map(course => (
            <Tag color="blue" key={course.courseID}>
              {course.courseName}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small" 
            onClick={() => {
              setSelectedStudent(record);
              setActiveTabKey('2'); // Automatically switch to the Enrollment Tracking tab
            }}
          >
            Track Enrollment
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <Content style={{ padding: '20px' }}>
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
        {/* Tab for Student Profile */}
        <TabPane tab="Student Profile" key="1">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              {/* Search Input with custom size, width, and an icon */}
              <Input
                placeholder="Search student by name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="large"
                style={{ marginBottom: '20px', width: '100%' }}
                prefix={<SearchOutlined />}
              />
            </Col>
          </Row>

          {/* Loading Spinner */}
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
            </div>
          ) : (
            // Conditionally render the student table only if there are search results
            searchQuery && filteredStudents.length > 0 ? (
              <Table
                columns={studentColumns}
                dataSource={filteredStudents}
                rowKey="key"
                pagination={false}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedStudent(record);
                    setActiveTabKey('2');
                  }
                })}
                scroll={{ x: 'max-content' }} // Enable horizontal scrolling
              />
            ) : (
              <Alert message="No students found" type="warning" showIcon />
            )
          )}
        </TabPane>

        {/* Tab for Enrollment Tracking */}
        <TabPane tab="Enrollment Tracking" key="2">
          <Row gutter={16}>
            <Col xs={24}>
              <h3>Track student enrollments here.</h3>
              {selectedStudent ? (
                <div style={{ marginBottom: '20px' }}>
                  <h4>{selectedStudent.name} ({selectedStudent.studentID})</h4>
                  <Table
                    dataSource={selectedStudent.enrollments}
                    columns={[
                      { title: 'Course ID', dataIndex: 'courseID', key: 'courseID' },
                      { title: 'Course Name', dataIndex: 'courseName', key: 'courseName' },
                      { title: 'Status', dataIndex: 'status', key: 'status' },
                      { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
                      { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
                    ]}
                    pagination={false}
                    rowKey="courseID"
                    scroll={{ x: 'max-content' }}  // Enable horizontal scrolling for mobile
                  />
                </div>
              ) : (
                <Alert message="Select a student to track their enrollments." type="info" />
              )}
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Content>
  );
};

export default StudentISPageDashboard;
