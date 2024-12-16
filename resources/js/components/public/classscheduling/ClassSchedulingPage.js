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
import {
    DeleteOutlined,
    EditFilled,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
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
    const [dataSection, setDataSection] = useState([]);

    useEffect(() => {
        const handleFetchSubject = async () => {
            const apiUrl = window.location.origin;
            try {
                const response = await axios.get(`${apiUrl}/api/subject`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "auth_token"
                        )}`,
                    },
                });

                setDataSubject(response.data.data);
            } catch (error) {
                console.log("Error: ", error);
            } finally {
                //
            }
        };

        handleFetchSubject();

        const handleFetchRoom = async () => {
            const apiUrl = window.location.origin;
            try {
                const response = await axios.get(`${apiUrl}/api/room`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "auth_token"
                        )}`,
                    },
                });

                setDataRoom(response.data.data);
            } catch (error) {
                console.log("Error: ", error);
            } finally {
                //
            }
        };

        handleFetchRoom();

        const handleFetchFAculty = async () => {
            const apiUrl = window.location.origin;
            try {
                const response = await axios.get(
                    `${apiUrl}/api/profiles?role_ids=3`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "auth_token"
                            )}`,
                        },
                    }
                );

                setDataInstructor(response.data.data);
            } catch (error) {
                console.log("Error: ", error);
            } finally {
                //
            }
        };

        handleFetchFAculty();

        const handleFetchSection = async () => {
            const apiUrl = window.location.origin;
            try {
                const response = await axios.get(
                    `${apiUrl}/api/classifiedsection`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "auth_token"
                            )}`,
                        },
                    }
                );

                setDataSection(response.data);
            } catch (error) {
                console.log("Error: ", error);
            } finally {
                //
            }
        };

        handleFetchSection();

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
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() =>
                            setToggleModalFormSchedule({
                                open: true,
                                data: record,
                            })
                        }
                        icon={<EditFilled />}
                    />
                    <Button
                        type="link"
                        danger
                        onClick={() => deleteSchedule(record.key)}
                        icon={<DeleteOutlined />}
                    />
                </Space>
            ),
        },
        {
            title: "Created At",
            dataIndex: "created_at_format",
            key: "created_at_format",
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
        },
        {
            title: "Classroom",
            dataIndex: "section",
            key: "classroom",
        },
        {
            title: "Instructor",
            dataIndex: "instructor",
            key: "instructor",
        },
        {
            title: "Time Start",
            dataIndex: "start_time",
            key: "start_time",
        },
        {
            title: "Time End",
            dataIndex: "end_time",
            key: "end_time",
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

                <ModalFormScheduling
                    toggleModalForm={toggleModalFormSchedule}
                    setToggleModalForm={setToggleModalFormSchedule}
                    dataSubject={dataSubject}
                    dataRoom={dataRoom}
                    dataInstructor={dataInstructor}
                    handleFetch={handleFetch}
                    dataSection={dataSection}
                />
            </Content>
        </MainDashboard>
    );
};

export default ClassSchedulingPage;
