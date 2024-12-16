// RoomModal.js
import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, Select, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { message } from "antd";
import axios from "axios"; // Ensure axios is imported

const RoomModal = ({
    toggleModalForm,
    setToggleModalForm,
    dataBuilding,
    dataFloor,
    fetchRooms,
}) => {
    const [form] = useForm();
    const [loadingFloors, setLoadingFloors] = useState(false);

    const handleOk = async () => {
        form.submit();
    };

    const handleCancel = () => {
        setToggleModalForm({
            open: false,
            data: null,
        });
    };

    const onFinish = async (values) => {
        setLoadingFloors(true);
        const apiUrl = window.location.origin;

        let data = {
            ...values,
            id: toggleModalForm.data ? toggleModalForm.data.id : null,
        };

        try {
            let response = await axios.post(`${apiUrl}/api/room`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "auth_token"
                    )}`,
                },
            });

            if (response.status === 200) {
                let res = response.data;

                if (res.success) {
                    setToggleModalForm({
                        open: false,
                        data: null,
                    });
                    form.resetFields();
                    fetchRooms();
                    notification.success({
                        message: "Room",
                        description: res.message,
                    });
                } else {
                    notification.error({
                        message: "Room",
                        description: res.message,
                    });
                }
            } else {
                notification.error({
                    message: "Room",
                    description:
                        "An error occurred: " + JSON.stringify(response),
                });
            }

            setLoadingFloors(false);
        } catch (error) {
            notification.error({
                message: "Room",
                description: "An error occurred: " + JSON.stringify(error),
            });
        } finally {
            setLoadingFloors(false);
        }
    };

    useEffect(() => {
        if (toggleModalForm.data) {
            form.setFieldsValue({
                ...toggleModalForm.data,
            });
        } else {
            form.resetFields();
        }

        return () => {};
    }, [toggleModalForm]);

    return (
        <Modal
            title={toggleModalForm.data ? "Edit Building" : "Create Building"}
            open={toggleModalForm.open}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={toggleModalForm.data ? "Update" : "Create"}
            loading={loadingFloors}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Room"
                    name="room_code"
                    rules={[
                        {
                            required: true,
                            message: "Please enter the room name",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Building"
                    name="building_id"
                    rules={[
                        { required: true, message: "Please select a building" },
                    ]}
                >
                    <Select
                        placeholder="Select building"
                        options={dataBuilding.map((building) => ({
                            label: building.building_name,
                            value: building.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Floor Level"
                    name="floor_id"
                    rules={[
                        { required: true, message: "Please select a floor" },
                    ]}
                >
                    <Select
                        placeholder="Select floor"
                        options={dataFloor.map((floor) => ({
                            label: floor.floor_name,
                            value: floor.id,
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoomModal;
