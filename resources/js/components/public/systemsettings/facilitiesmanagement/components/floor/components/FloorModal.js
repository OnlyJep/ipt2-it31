import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputNumber, notification } from 'antd';
import axios from 'axios'; // For making the GET request to read data

const FloorModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateFloor,
    modalData,
}) => {
    const [form] = Form.useForm();
    const [existingFloors, setExistingFloors] = useState([]); // Store existing floors
    const [loading, setLoading] = useState(false); // To manage loading state

    // Fetch existing floors when the modal is opened
    useEffect(() => {
        if (isCreateModalVisible) {
            setLoading(true);
            axios
                .get('/api/floors') // Replace with your actual API endpoint
                .then(response => {
                    setExistingFloors(response.data); // Assuming response.data is an array of floor levels
                })
                .catch(error => {
                    console.error("Error fetching floors:", error);
                    notification.error({
                        message: 'Failed to Load Floors',
                        description: 'There was an error fetching existing floors.',
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isCreateModalVisible]);

    // Prefill the form with data if editing
    useEffect(() => {
        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                floor_level: modalData.floor_level,
            });
        } else if (isCreateModalVisible) {
            form.resetFields();
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // Custom validation for floor level
    const checkIfFloorExists = (rule, value) => {
        if (value && existingFloors.includes(value)) {
            return Promise.reject('Floor level already exists');
        }
        return Promise.resolve();
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            // If validation passes, save the floor
            const { floor_level } = values;
            handleCreateFloor({ floor_level });
            handleCancel();
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
                <Button key="save" type="primary" onClick={handleSave} loading={loading}>
                    Save
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="floor_level"
                    label="Floor Level"
                    rules={[
                        { required: true, message: 'Please input the floor level' },
                        { validator: checkIfFloorExists }, // Custom validation to check if floor exists
                    ]}
                >
                    <InputNumber min={1} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FloorModal;
