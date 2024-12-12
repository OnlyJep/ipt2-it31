import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

const StudentEnlistmentModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            form.setFieldsValue({
                profile_id: modalData.profile_id, 
                classschedule_id: modalData.classschedule_id,
                academicyear_id: modalData.academicyear_id,
                semester_id: modalData.semester_id,
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const { profile_id, classschedule_id, academicyear_id, semester_id } = values;

            // Validate that all fields have values
            if (!profile_id || !classschedule_id || !academicyear_id || !semester_id) {
                message.error('Please fill in all required fields');
                return;
            }

            if (isEditModalVisible) {
                // Handle update logic for an existing enlistment
                const updatedData = data.map((enlistment) =>
                    enlistment.id === modalData.id
                        ? { ...enlistment, ...values, updated_at: new Date().toISOString() }
                        : enlistment
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Student Enlistment updated successfully');
            } else {
                // Handle create logic for a new student enlistment
                const newEnlistment = {
                    id: Date.now(), // Auto-generate unique ID using timestamp
                    ...values,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newEnlistment]);
                setIsCreateModalVisible(false);
                message.success('New Student Enlistment created successfully');
            }
            form.resetFields(); // Reset the form fields
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); // Clear the form when the modal is canceled
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Student Enlistment' : 'Create New Student Enlistment'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Student Enlistment'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="studentEnlistmentForm">
                <Form.Item
                    label="Profile ID"
                    name="profile_id"
                    rules={[{ required: true, message: 'Please enter the profile ID!' }]}
                >
                    <Input placeholder="Enter profile ID" />
                </Form.Item>
                <Form.Item
                    label="Class Schedule ID"
                    name="classschedule_id"
                    rules={[{ required: true, message: 'Please enter the class schedule ID!' }]}
                >
                    <Input placeholder="Enter class schedule ID" />
                </Form.Item>
                <Form.Item
                    label="Academic Year ID"
                    name="academicyear_id"
                    rules={[{ required: true, message: 'Please enter the academic year ID!' }]}
                >
                    <Input placeholder="Enter academic year ID" />
                </Form.Item>
                <Form.Item
                    label="Semester ID"
                    name="semester_id"
                    rules={[{ required: true, message: 'Please enter the semester ID!' }]}
                >
                    <Input placeholder="Enter semester ID" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default StudentEnlistmentModal;
