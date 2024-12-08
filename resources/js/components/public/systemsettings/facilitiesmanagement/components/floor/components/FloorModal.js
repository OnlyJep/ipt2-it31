import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputNumber, message } from 'antd';
import axios from 'axios';

const FloorModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateFloor,
    modalData,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Prefill if editing
            form.setFieldsValue({
                floor_level: modalData.floor_level,
            });
        } else if (isCreateModalVisible) {
            form.resetFields();
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    const handleSave = async () => {
        try {
            // Validate form fields
            const values = await form.validateFields();
            const floorLevel = values.floor_level;

            // Check if the floor level already exists by making an API request
            const response = await axios.post('/api/floor/check', { floor_level: floorLevel });

            if (response.data.exists) {
                message.error('This floor level already exists!');
            } else {
                // Proceed to save the new floor level if it doesn't exist
                handleCreateFloor({ floor_level: floorLevel });
            }
        } catch (error) {
            console.error("Error saving floor:", error);
            message.error('An error occurred while saving the floor.');
        }
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Floor' : 'Create New Floor'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Save
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" name="floorForm">
                <Form.Item
                    label="Floor Level"
                    name="floor_level"
                    rules={[{ required: true, message: 'Please enter a floor level' }]}
                >
                    <InputNumber min={1} max={100} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FloorModal;
