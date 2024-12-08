// DepartmentModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

const DepartmentModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateDepartment, // New prop for creating
    handleEditDepartment,   // New prop for editing
    modalData,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            form.setFieldsValue({
                department_name: modalData.department_name, // Editable department name
            });
        } else if (isCreateModalVisible) {
            form.resetFields();
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const departmentName = values.department_name.trim();

            if (isEditModalVisible) {
                // Handle update logic via parent handler
                handleEditDepartment(modalData.id, { department_name: departmentName });
            } else {
                // Handle create logic via parent handler
                handleCreateDepartment({ department_name: departmentName });
            }

            form.resetFields(); // Reset the form fields after submission
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); // Clear the form when the modal is canceled
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Department' : 'Create New Department'}
            visible={isCreateModalVisible || isEditModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Department'}
            cancelText="Cancel"
            destroyOnClose // Ensure form is reset when modal is closed
        >
            <Form form={form} layout="vertical" name="departmentForm">
                <Form.Item
                    label="Department Name"
                    name="department_name"
                    rules={[
                        { required: true, message: 'Please enter a department name!' },
                        { min: 2, message: 'Department name must be at least 2 characters.' },
                    ]}
                >
                    <Input placeholder="Enter department name (e.g., Computer Science)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DepartmentModal;
