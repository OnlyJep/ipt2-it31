// SectionCatalogModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Form, message } from 'antd';

const SectionCatalogModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateSection, // Handler for creating a section
    handleEditSection,   // Handler for editing a section
    modalData,           // Data to prefill the form when editing
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with existing section data when editing
            form.setFieldsValue({
                section_name: modalData.section_name,
            });
        } else if (isCreateModalVisible) {
            form.resetFields(); // Reset form fields when creating
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // Handle form submission
    const handleOk = () => {
        form.validateFields().then((values) => {
            const sectionName = values.section_name.trim();

            if (isEditModalVisible) {
                // Invoke the edit handler with section ID and updated data
                handleEditSection(modalData.id, { section_name: sectionName });
            } else {
                // Invoke the create handler with new section data
                handleCreateSection({ section_name: sectionName });
            }

            form.resetFields(); // Reset the form after submission
        }).catch((info) => {
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
            title={isEditModalVisible ? 'Edit Section' : 'Create New Section'}
            visible={isCreateModalVisible || isEditModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Section'}
            cancelText="Cancel"
            destroyOnClose // Ensure form is reset when modal is closed
        >
            <Form form={form} layout="vertical" name="sectionCatalogForm">
                <Form.Item
                    label="Section Name"
                    name="section_name"
                    rules={[
                        { required: true, message: 'Please enter a section name!' },
                        { min: 2, message: 'Section name must be at least 2 characters.' },
                    ]}
                >
                    <Input placeholder="Enter section name (e.g., Electronics)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SectionCatalogModal;
