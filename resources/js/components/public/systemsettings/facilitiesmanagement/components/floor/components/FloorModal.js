import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputNumber } from 'antd';

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

    const handleSave = () => {
        form.validateFields().then(values => {
            // values.floor_level is guaranteed to be a number
            handleCreateFloor({ floor_level: values.floor_level });
        });
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
                    rules={[{ required: true, message: 'Please enter a floor level!' }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Enter Floor Level (numbers only)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FloorModal;
