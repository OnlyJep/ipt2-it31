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
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

export default function ModalFormScheduling(props) {
    const { toggleModalForm, setToggleModalForm, handleFetch } = props;

    const [form] = Form.useForm();

    const [isLoading, setIsLoading] = useState(false);

    const [dataDepartment, setDataDepartment] = useState([]);

    useEffect(() => {
        const handleFetch = async () => {
            const apiUrl = window.location.origin;
            try {
                const response = await axios.get(`${apiUrl}/api/department`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "auth_token"
                        )}`,
                    },
                });

                setDataDepartment(response.data.data);
            } catch (error) {
                console.error("Error fetching faculty data:", error);
            } finally {
            }
        };

        handleFetch();

        return () => {};
    }, []);

    const onFinish = async (values) => {
        setIsLoading(true);
        console.log("Received values of form:", values);
        const apiUrl = window.location.origin;

        let data = {
            ...values,
            date_of_birth: dayjs(values.date_of_birth).format("YYYY-MM-DD"),
            id: toggleModalForm.data ? toggleModalForm.data.id : null,
        };

        try {
            let response = await axios.post(`${apiUrl}/api/profiles`, data, {
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
                date_of_birth: dayjs(toggleModalForm.data.date_of_birth),
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
                            name="school_email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: "Email is required",
                                },
                                {
                                    type: "email",
                                    message: "Email is not valid",
                                },
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
