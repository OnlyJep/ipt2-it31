import React from 'react';
import { Table } from 'antd';

// Example timetable data
const timetableData = [
  { key: 1, day: 'Monday', time: '9:00 AM - 11:00 AM', course: 'CS101' },
  { key: 2, day: 'Tuesday', time: '1:00 PM - 3:00 PM', course: 'CS102' },
  { key: 3, day: 'Wednesday', time: '10:00 AM - 12:00 PM', course: 'CS201' },
  { key: 4, day: 'Thursday', time: '11:00 AM - 1:00 PM', course: 'CS102' },
];

const TeacherTimetable = () => {
  const columns = [
    {
      title: 'Day',
      dataIndex: 'day',
    },
    {
      title: 'Time',
      dataIndex: 'time',
    },
    {
      title: 'Course',
      dataIndex: 'course',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={timetableData}
      pagination={false}
      title={() => 'Teacher Timetable'}
      style={{ marginBottom: 24 }}
    />
  );
};

export default TeacherTimetable;
