import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

const SemesterModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData,
    handleEditSemester,
    handleCreateSemester,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            form.setFieldsValue({
                semester_period: modalData.semester_period, // Editable semester period
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            // Ensure the semester_period is trimmed to avoid issues with extra spaces
            const semesterPeriodName = values.semester_period.trim();
    
            // Only send necessary data to the backend (just semester_period)
            const sanitizedValues = { semester_period: semesterPeriodName };
    
            if (isEditModalVisible) {
                // Handle the update logic for an existing semester
                handleEditSemester(modalData.id, sanitizedValues);
            } else {
                // Handle the create logic for a new semester
                handleCreateSemester(sanitizedValues);
            }
    
            // Reset the form fields after submission
            form.resetFields();
        }).catch((info) => {
            // Catch any form validation errors
            console.log('Validate Failed:', info);
        });
    };
    
    
    
    
    
    
    
    const handleCancel = () => {
        form.resetFields(); // Reset the form fields when the modal is closed
        setIsCreateModalVisible(false); // Close the "Create" modal
        setIsEditModalVisible(false); // Close the "Edit" modal
    };
    
    

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Semester Period' : 'Create New Semester Period'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Semester Period'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="semesterForm">
                <Form.Item
                    label="Semester Period"
                    name="semester_period"
                    rules={[{ required: true, message: 'Please enter a semester period!' }]}
                >
                    <Input placeholder="Enter semester period (e.g., Fall, Spring)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SemesterModal;
