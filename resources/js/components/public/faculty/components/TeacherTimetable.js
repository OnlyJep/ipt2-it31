import React from 'react';
import { Card, Table } from 'antd';

// TeacherTimetable component to display timetable data
const TeacherTimetable = ({ timetable, searchQuery }) => {
    // Filter timetable based on search query
    const filteredTimetable = timetable.filter(
        entry => entry.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card title="Teacher Timetable" bordered={false}>
            <Table
                dataSource={filteredTimetable}
                columns={[
                    { title: 'Teacher', dataIndex: 'teacherName', key: 'teacherName' },
                    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
                    { title: 'Time', dataIndex: 'time', key: 'time' },
                ]}
                rowKey="id"
            />
        </Card>
    );
};

export default TeacherTimetable;
