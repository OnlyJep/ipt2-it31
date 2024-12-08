// BuildingModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, Select} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { message } from 'antd';

const BuildingModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData,
    handleCreateBuilding, // Pass the handler for creating a building
    reloadData,
}) => {
    const [form] = useForm(); // Ant Design Form hook for form handling
    const [floors, setFloors] = useState([]); // Floors data for dropdown
    const [loadingFloors, setLoadingFloors] = useState(false); // Loading state for floors

    useEffect(() => {
        // Fetch floors when the modal is opened
        const fetchFloors = async () => {
            try {
                const response = await axios.get('/api/floor', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                setFloors(response.data); // Set the floors data
            } catch (error) {
                message.error('Failed to load floors');
            }
        };

        if (isCreateModalVisible || isEditModalVisible) {
            fetchFloors();
        }

        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                building_name: modalData.building_name, // Pre-fill the form if editing
                floor_id: modalData.floor_id, // Set the selected floor ID
            });
        }
    }, [isCreateModalVisible, isEditModalVisible, modalData, form]);

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            form.setFieldsValue({
                building_name: modalData.building_name, // Editable building name
                floor_id: modalData.floor_id, // Editable floor ID
            });
        } else {
            // Reset form for new building
            form.resetFields();
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = async () => {
        form.validateFields().then(async (values) => {
            if (isEditModalVisible) {
                // Handle update logic for an existing building
                try {
                    const token = localStorage.getItem('auth_token');
                    const response = await axios.put(`/api/building/${modalData.id}`, values, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const updatedData = data.map((building) =>
                        building.id === modalData.id ? { ...building, ...response.data.building } : building
                    );
                    setData(updatedData);
                    setIsEditModalVisible(false);
                    message.success('Building updated successfully');
                } catch (error) {
                    message.error('Failed to update building');
                }
            } else {
                // Handle create logic for a new building
                try {
                    const token = localStorage.getItem('auth_token');
                    const response = await axios.post('/api/building', values, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setData((prevData) => [...prevData, response.data.building]);
                    setIsCreateModalVisible(false);
                    message.success('Building created successfully');
                } catch (error) {
                    message.error('Failed to create building');
                }
            }
        });
    };
    

    const handleCancel = () => {
        setIsCreateModalVisible(false); // Close modal when canceled
        setIsEditModalVisible(false); // Ensure edit modal is also closed
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Building' : 'Create Building'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={() => {
                setIsCreateModalVisible(false);
                setIsEditModalVisible(false);
            }}
            onOk={handleOk}
            okText={isEditModalVisible ? 'Update' : 'Create'}
        >
            <Form form={form} layout="vertical" name="building_form">
                <Form.Item
                    label="Building Name"
                    name="building_name"
                    rules={[{ required: true, message: 'Please enter the building name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Floor Level"
                    name="floor_id"
                    rules={[{ required: true, message: 'Please select a floor' }]}
                >
                    <Select loading={loadingFloors} placeholder="Select floor">
                        {floors.map((floor) => (
                            <Select.Option key={floor.id} value={floor.id}>
                                {floor.floor_level}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BuildingModal;
