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
    Row,
    Col,
} from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import MainDashboard from "../dashboard/components/MainDashboard";
import ModalFormScheduling from "./components/ModalFormScheduling";

const { Content } = Layout;
const { Option } = Select;

const ClassSchedulingPage = () => {
    const [form] = Form.useForm();
    const [schedules, setSchedules] = useState([]);

    const [toggleModalFormSchedule, setToggleModalFormSchedule] = useState({
        open: false,
        data: null,
    });

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "created_at_format",
        sort_order: "desc",
        status: "Active",
    });
    const [tableLoading, setTableLoading] = useState(false);
    const [dataClassSchedule, setDataClassSchedule] = useState([]);

    const [dataSubject, setDataSubject] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    const [dataInstructor, setDataInstructor] = useState([]);

    useEffect(() => {
        const handleFetchSubject = async () => {
            const apiUrl = window.location.origin;
            try {
                setTableLoading(true);
                const response = await axios.get(
                    `${apiUrl}/api/subject?${new URLSearchParams(tableFilter)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "auth_token"
                            )}`,
                        },
                    }
                );

                setDataSubject(response.data);
            } catch (error) {
                console.log("Error: ", error);
            } finally {
                //
            }
        };

        handleFetchSubject();

        return () => {};
    }, []);

    const handleFetch = async () => {
        const apiUrl = window.location.origin;
        try {
            setTableLoading(true);
            const response = await axios.get(
                `${apiUrl}/api/classschedule?${new URLSearchParams(
                    tableFilter
                )}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "auth_token"
                        )}`,
                    },
                }
            );

            console.log("response.data", response.data);

            setDataClassSchedule(response.data);
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        console.log("Fetching faculty data... faculty_list");

        handleFetch();

        return () => {};
    }, [tableFilter]);

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
            <Content>
                <Row gutter={[20, 20]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <h2 style={{ marginBottom: "20px" }}>
                            Class Scheduling Management
                        </h2>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() =>
                                setToggleModalFormSchedule({
                                    open: true,
                                    data: null,
                                })
                            }
                        >
                            Add Schedule
                        </Button>
                    </Col>
                </Row>

                {/* Class Schedule Table */}
                <Table
                    dataSource={
                        dataClassSchedule &&
                        dataClassSchedule.data &&
                        dataClassSchedule.data.data
                            ? dataClassSchedule.data.data
                            : []
                    }
                    columns={columns}
                    style={{ marginTop: "20px" }}
                    loading={tableLoading}
                    onChange={(pagination, filters, sorter) => {
                        setTableFilter((prevFilter) => ({
                            ...prevFilter,
                            sort_field: sorter.field,
                            sort_order: sorter.order,
                        }));
                    }}
                />

                {/* <ModalFormScheduling
                    toggleModalForm={toggleModalFormSchedule}
                    setToggleModalForm={setToggleModalFormSchedule}
                /> */}
            </Content>
        </MainDashboard>
    );
};

export default ClassSchedulingPage;
