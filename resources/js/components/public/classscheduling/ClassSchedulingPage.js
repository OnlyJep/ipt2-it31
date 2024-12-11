import React, { useEffect, useState } from "react";
import {
    Layout,
    Form,
    Input,
    Select,
    DatePicker,
    TimePicker,
    Button,
    Table,
    Space,
    message,
    notification,
} from "antd";
import axios from "axios";

import MainDashboard from "../dashboard/components/MainDashboard";
const { Content } = Layout;
const { Option } = Select;

const ClassSchedulingPage = () => {
    const [form] = Form.useForm();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleFetch = async () => {
            const token = localStorage.getItem("auth_token");

            const response = await axios.get(
                `${window.location.origin}/api/user_list?role_id=3`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("response: ", response);
        };

        handleFetch();
        return () => {};
    }, []);

    const columns = [
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
        },
        {
            title: "Classroom",
            dataIndex: "classroom",
            key: "classroom",
        },
        {
            title: "Instructor",
            dataIndex: "instructor",
            key: "instructor",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => editSchedule(record)}>
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => deleteSchedule(record.key)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const newSchedule = {
                key: schedules.length + 1,
                subject: values.subject,
                classroom: values.classroom,
                instructor: values.instructor,
                date: values.date.format("YYYY-MM-DD"),
                time: `${values.startTime.format(
                    "HH:mm"
                )} - ${values.endTime.format("HH:mm")}`,
            };

            console.log("newSchedule: ", newSchedule);

            form.resetFields();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            notification.error({
                message: "Class Scheduling",
                description: "An error occured: " + JSON.stringify(error),
            });
        }
    };

    const editSchedule = (record) => {
        form.setFieldsValue({
            subject: record.subject,
            classroom: record.classroom,
            instructor: record.instructor,
            date: record.date,
            startTime: record.time.split(" - ")[0],
            endTime: record.time.split(" - ")[1],
        });
    };

    const deleteSchedule = (key) => {
        const updatedSchedules = schedules.filter(
            (schedule) => schedule.key !== key
        );
        setSchedules(updatedSchedules);
        message.success("Schedule deleted successfully!");
    };

    return (
        <MainDashboard>
            <Content
                style={{
                    padding: "20px",
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h2 style={{ marginBottom: "20px" }}>
                    Class Scheduling Management
                </h2>

                {/* Class Scheduling Form */}
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Subject"
                        name="subject"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the subject",
                            },
                        ]}
                    >
                        <Input placeholder="Enter Subject" />
                    </Form.Item>

                    <Form.Item
                        label="Classroom"
                        name="classroom"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the classroom",
                            },
                        ]}
                    >
                        <Input placeholder="Enter Classroom" />
                    </Form.Item>

                    <Form.Item
                        label="Instructor"
                        name="instructor"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the instructor name",
                            },
                        ]}
                    >
                        <Input placeholder="Enter Instructor" />
                    </Form.Item>

                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: "Please select the date",
                            },
                        ]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Start Time"
                        name="startTime"
                        rules={[
                            {
                                required: true,
                                message: "Please select the start time",
                            },
                        ]}
                    >
                        <TimePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="End Time"
                        name="endTime"
                        rules={[
                            {
                                required: true,
                                message: "Please select the end time",
                            },
                        ]}
                    >
                        <TimePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                Submit
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

                {/* Class Schedule Table */}
                <Table
                    dataSource={schedules}
                    columns={columns}
                    style={{ marginTop: "20px" }}
                />
            </Content>
        </MainDashboard>
    );
};

export default ClassSchedulingPage;
