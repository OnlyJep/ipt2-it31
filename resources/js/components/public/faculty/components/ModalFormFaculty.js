import {
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
} from "antd";
import InputMask from "react-input-mask";

export default function ModalFormFaculty(props) {
    const { toggleModalForm, setToggleModalForm } = props;

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Received values of form:", values);
    };

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
            okText="Save All Schedules"
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={[20, 0]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="email" label="Email">
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="password" label="Password">
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="first_name" label="First Name">
                            <Input placeholder="First Name" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="middle_initial" label="Middle Initial">
                            <Input placeholder="Middle Initial" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name="last_name" label="Last Name">
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
                        <Form.Item name="phone_number" label="Phone Number">
                            <InputNumber
                                placeholder="Phone Number"
                                controls={false}
                                style={{ width: "100%" }}
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
