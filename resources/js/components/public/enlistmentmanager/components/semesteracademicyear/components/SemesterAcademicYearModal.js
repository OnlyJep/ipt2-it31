import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

const SemesterAcademicYearModal = ({
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
                academicyear_id: modalData.academicyear_id,
                semester_id: modalData.semester_id,
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const { academicyear_id, semester_id } = values;

            // Validate that all fields have values
            if (!academicyear_id || !semester_id) {
                message.error('Please fill in all required fields');
                return;
            }

            if (isEditModalVisible) {
                // Handle update logic for an existing Semester Academic Year entry
                const updatedData = data.map((entry) =>
                    entry.id === modalData.id
                        ? { ...entry, ...values, updated_at: new Date().toISOString() }
                        : entry
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Semester Academic Year updated successfully');
            } else {
                // Handle create logic for a new Semester Academic Year entry
                const newEntry = {
                    id: Date.now(), // Auto-generate unique ID using timestamp
                    ...values,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newEntry]);
                setIsCreateModalVisible(false);
                message.success('New Semester Academic Year created successfully');
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
            title={isEditModalVisible ? 'Edit Semester Academic Year' : 'Create New Semester Academic Year'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Entry'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="semesterAcademicYearForm">
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

export default SemesterAcademicYearModal;
