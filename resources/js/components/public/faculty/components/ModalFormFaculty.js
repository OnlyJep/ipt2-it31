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
import optionReligions from "./optionReligions";

export default function ModalFormFaculty(props) {
    const { toggleModalForm, setToggleModalForm, handleFetch } = props;

    const [form] = Form.useForm();

    const [isLoading, setIsLoading] = useState(false);

    const [dataDepartment, setDataDepartment] = useState([]);

    useEffect(() => {
        const handleFetchDep = async () => {
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

        handleFetchDep();

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
            title="Faculty Form"
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

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: toggleModalForm.data
                                        ? false
                                        : true,
                                    message: "Password is required",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="first_name"
                            label="First Name"
                            rules={[
                                {
                                    required: true,
                                    message: "First Name is required",
                                },
                            ]}
                        >
                            <Input placeholder="First Name" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="middle_initial" label="Middle Initial">
                            <Input placeholder="Middle Initial" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="last_name"
                            label="Last Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Last Name is required",
                                },
                            ]}
                        >
                            <Input placeholder="Last Name" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="suffix" label="Suffix">
                            <Input placeholder="Suffix" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="sex" label="Sex">
                            <Select
                                placeholder="Sex"
                                options={[
                                    {
                                        value: "Male",
                                        label: "Male",
                                    },
                                    {
                                        value: "Female",
                                        label: "Female",
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="date_of_birth" label="Date of Birth">
                            <DatePicker
                                placeholder="Date of Birth"
                                format="MM/DD/YYYY"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="marital_status" label="Civil Status">
                            <Select
                                placeholder="Civil Status"
                                options={[
                                    {
                                        value: "Single",
                                        label: "Single",
                                    },
                                    {
                                        value: "Married",
                                        label: "Married",
                                    },
                                    {
                                        value: "Separated",
                                        label: "Separated",
                                    },
                                    {
                                        value: "Widowed",
                                        label: "Widowed",
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="religion" label="Religion">
                            <Select
                                placeholder="Religion"
                                options={optionReligions.map((item) => ({
                                    value: item.value,
                                    label: item.label,
                                }))}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="phone_number" label="Phone Number">
                            <InputNumber
                                placeholder="Phone Number"
                                controls={false}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="department_id"
                            label="Department"
                            rules={[
                                {
                                    required: true,
                                    message: "Department is required",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Department"
                                options={dataDepartment.map((item) => ({
                                    value: item.id,
                                    label: item.department_name,
                                }))}
                                allowClear
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="profile_status" label="Faculty Status">
                            <Select
                                placeholder="Faculty Status"
                                options={[
                                    {
                                        value: "Full-time",
                                        label: "Full Time",
                                    },
                                    {
                                        value: "Part-time",
                                        label: "Part Time",
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="address" label="Address">
                            <Input.TextArea placeholder="Address" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
