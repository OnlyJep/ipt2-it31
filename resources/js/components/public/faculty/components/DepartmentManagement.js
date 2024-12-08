import React, { useState } from 'react';
import { Button, Card, Table, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const DepartmentManagement = ({ facultyMembers, onAssignCourse }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const handleAddCourse = (teacherId) => {
        setSelectedTeacher(teacherId);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        onAssignCourse(selectedTeacher, values.course);
        setIsModalVisible(false);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Assigned Courses', dataIndex: 'courses', render: (courses) => courses.join(', ') },
        {
            title: 'Action',
            render: (_, record) => (
                <Button onClick={() => handleAddCourse(record.id)} icon={<PlusOutlined />}>
                    Assign Course
                </Button>
            ),
        },
    ];

    return (
        <Card title="Department Management" bordered={false}>
            <Table
                dataSource={facultyMembers}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
            <Modal
                title="Assign Course"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form onFinish={handleSubmit}>
                    <Form.Item
                        label="Course Name"
                        name="course"
                        rules={[{ required: true, message: 'Please input the course name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Assign</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default DepartmentManagement;
