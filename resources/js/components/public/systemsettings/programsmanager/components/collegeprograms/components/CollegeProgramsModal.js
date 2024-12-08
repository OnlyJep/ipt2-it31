// CollegeProgramsModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Form, Select, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

const CollegeProgramsModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateCollegeProgram, // Handler for creating a college program
    handleEditCollegeProgram,   // Handler for editing a college program
    modalData,                  // Data to prefill the form when editing
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with existing college program data when editing
            form.setFieldsValue({
                college_programs: modalData.college_programs,
                study_type: modalData.study_type,
            });
        } else if (isCreateModalVisible) {
            form.resetFields(); // Reset form fields when creating
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // Handle form submission
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const programName = values.college_programs.trim();
                const studyType = values.study_type;

                if (isEditModalVisible) {
                    // Invoke the edit handler with program ID and updated data
                    handleEditCollegeProgram(modalData.id, { 
                        college_programs: programName,
                        study_type: studyType,
                    });
                } else {
                    // Invoke the create handler with new program data
                    handleCreateCollegeProgram({ 
                        college_programs: programName,
                        study_type: studyType,
                    });
                }

                form.resetFields(); // Reset the form after submission
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    // Handle modal cancellation
    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); // Reset the form when modal is closed
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit College Program' : 'Create New College Program'}
            visible={isCreateModalVisible || isEditModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Program'}
            cancelText="Cancel"
            destroyOnClose // Ensure form is reset when modal is closed
        >
            <Form form={form} layout="vertical" name="collegeProgramForm">
                <Form.Item
                    label="College Program Name"
                    name="college_programs"
                    rules={[
                        { required: true, message: 'Please enter a college program name!' },
                        { min: 2, message: 'Program name must be at least 2 characters.' },
                    ]}
                >
                    <Input placeholder="Enter college program name (e.g., Computer Science)" />
                </Form.Item>

                <Form.Item
                    label="Study Type"
                    name="study_type"
                    rules={[
                        { required: true, message: 'Please select a study type!' },
                    ]}
                >
                    <Select placeholder="Select study type">
                        <Option value="undergraduate">Undergraduate</Option>
                        <Option value="graduate">Graduate</Option>
                        <Option value="diploma">Diploma</Option>
                    </Select>
                </Form.Item>
            </Form>
            {/* Display error messages if needed */}
            {/* You can pass error messages as props if you want to display them here */}
        </Modal>
    );
};

export default CollegeProgramsModal;
