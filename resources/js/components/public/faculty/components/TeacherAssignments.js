import React from 'react';
import { Table, Button, Tag, Space } from 'antd';

const assignmentsData = [
  { key: 1, course: 'CS101', assignment: 'Assignment 1', dueDate: '2024-12-20', status: 'Pending' },
  { key: 2, course: 'CS102', assignment: 'Assignment 2', dueDate: '2024-12-22', status: 'Graded' },
  { key: 3, course: 'CS201', assignment: 'Midterm Exam', dueDate: '2024-12-25', status: 'Pending' },
];

const TeacherAssignments = () => {
  const columns = [
    {
      title: 'Course',
      dataIndex: 'course',
    },
    {
      title: 'Assignment',
      dataIndex: 'assignment',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Pending' ? 'geekblue' : 'green';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      render: (text, record) => (
        <Space size="middle">
          <Button>View</Button>
          <Button type="primary">Grade</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={assignmentsData}
      pagination={false}
      style={{ marginBottom: 24 }}
    />
  );
};

export default TeacherAssignments;
