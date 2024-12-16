import { useEffect, useState } from "react";
import {
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    notification,
    Row,
    Select,
    TimePicker,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

export default function ModalFormScheduling(props) {
    const {
        toggleModalForm,
        setToggleModalForm,
        dataSubject,
        dataRoom,
        dataInstructor,
        handleFetch,
        dataSection,
    } = props;

    const [form] = Form.useForm();

    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values) => {
        setIsLoading(true);
        console.log("Received values of form:", values);
        const apiUrl = window.location.origin;

        let data = {
            ...values,
            start_time: dayjs(values.start_time).format("HH:mm:ss"),
            end_time: dayjs(values.end_time).format("HH:mm:ss"),
            id: toggleModalForm.data ? toggleModalForm.data.id : null,
        };

        try {
            let response = await axios.post(
                `${apiUrl}/api/classschedule`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "auth_token"
                        )}`,
                    },
                }
            );

            if (response.status === 200) {
                let res = response.data;

                if (res.success) {
                    setToggleModalForm({
                        open: false,
                        data: null,
                    });
                    form.resetFields();
                    handleFetch();
                    notification.success({
                        message: "Faculty",
                        description: res.message,
                    });
                } else {
                    notification.error({
                        message: "Faculty",
                        description: res.message,
                    });
                }
            } else {
                notification.error({
                    message: "Faculty",
                    description:
                        "An error occurred: " + JSON.stringify(response),
                });
            }

            setIsLoading(false);
        } catch (error) {
            notification.error({
                message: "Faculty",
                description: "An error occurred: " + JSON.stringify(error),
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("toggleModalForm", toggleModalForm);

        if (toggleModalForm.data) {
            form.setFieldsValue({
                ...toggleModalForm.data,
                start_time: dayjs(
                    `${dayjs(toggleModalForm.data.created_at).format(
                        "YYYY-MM-DD"
                    )} ${toggleModalForm.data.start_time}`
                ),
                end_time: dayjs(
                    `${dayjs(toggleModalForm.data.created_at).format(
                        "YYYY-MM-DD"
                    )} ${toggleModalForm.data.end_time}`
                ),
            });
        } else {
            form.resetFields();
        }

        return () => {};
    }, [toggleModalForm]);

    return (
        <Modal
            title="Add Multiple Schedules"
            open={toggleModalForm.open}
            onCancel={() => {
                setToggleModalForm({
                    open: false,
                    data: null,
                });
                form.resetFields();
            }}
            onOk={() => {
                form.submit();
            }}
            isLoading={isLoading}
            okText="Submit"
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={[20, 0]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="start_time"
                            label="Start Time"
                            rules={[
                                {
                                    required: true,
                                    message: "Start Time is required",
                                },
                            ]}
                        >
                            <TimePicker
                                placeholder="Start Time"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="end_time"
                            label="End Time"
                            rules={[
                                {
                                    required: true,
                                    message: "End Time is required",
                                },
                            ]}
                        >
                            <TimePicker
                                placeholder="End Time"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="day_of_week"
                            label="Day of the Week"
                            rules={[
                                {
                                    required: true,
                                    message: "Day of the Week is required",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Day of the Week"
                                style={{ width: "100%" }}
                                options={[
                                    { value: "Monday", label: "Monday" },
                                    { value: "Tuesday", label: "Tuesday" },
                                    { value: "Wednesday", label: "Wednesday" },
                                    { value: "Thursday", label: "Thursday" },
                                    { value: "Friday", label: "Friday" },
                                    { value: "Saturday", label: "Saturday" },
                                    { value: "Sunday", label: "Sunday" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="room_id"
                            label="Room"
                            rules={[
                                {
                                    required: true,
                                    message: "Room is required",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Room"
                                options={dataRoom.map((room) => ({
                                    value: room.id,
                                    label: room.room_code,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="subject_id"
                            label="Subject"
                            rules={[
                                {
                                    required: true,
                                    message: "Subject is required",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Subject"
                                options={dataSubject.map((subject) => ({
                                    value: subject.id,
                                    label: subject.subject_code,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="classifiedsection_id"
                            label="Section"
                            rules={[
                                {
                                    required: true,
                                    message: "Section is required",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Section"
                                options={dataSection.map((section) => ({
                                    value: section.id,
                                    label: `${section.section} - ${section.collegeprogram} - ${section.yearlevel}`,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="profile_id"
                            label="Instructor"
                            rules={[
                                {
                                    required: true,
                                    message: "Instructor is required",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Instructor"
                                options={dataInstructor.map((instructor) => ({
                                    value: instructor.id,
                                    label: instructor.fullname,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
