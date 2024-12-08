import React from 'react';
import { Card, List } from 'antd';

// TeacherAssignment component to display assignment data
const TeacherAssignment = ({ assignments, searchQuery }) => {
    // Filter assignments based on search query
    const filteredAssignments = assignments.filter(
        assignment =>
            assignment.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card title="Teacher Assignments" bordered={false}>
            <List
                dataSource={filteredAssignments}
                renderItem={assignment => (
                    <List.Item>
                        {assignment.teacherName} - {assignment.subject} - {assignment.dueDate}
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default TeacherAssignment;
