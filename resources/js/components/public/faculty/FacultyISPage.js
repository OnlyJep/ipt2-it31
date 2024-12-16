import React, { useState, useEffect, useCallback } from "react";
import {
    Button,
    Input,
    Space,
    Dropdown,
    Menu,
    Typography,
    Row,
    Col,
    Table,
    Spin,
    Popconfirm,
    Flex,
    notification,
} from "antd";
import { EditOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";
import MainDashboard from "../dashboard/components/MainDashboard";
import ModalFormFaculty from "./components/ModalFormFaculty";

const { Text } = Typography;

const FacultyISPage = () => {
    // Static data for faculty

    const statuses = [
        { value: "Full-time", label: "Full Time" },
        { value: "Part-time", label: "Part Time" },
    ];

    const [dataFaculty, setDataFaculty] = useState([]);
    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "created_at_format",
        sort_order: "desc",
        status: "Active",
        profile_status: "Full-time",
    });
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [toggleModalForm, setToggleModalForm] = useState({
        open: false,
        data: null,
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 767);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFetch = async () => {
        const apiUrl = window.location.origin;
        try {
            setLoading(true);
            const response = await axios.get(
                `${apiUrl}/api/profiles?${new URLSearchParams(tableFilter)}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "auth_token"
                        )}`,
                    },
                }
            );
            console.log("Faculty data:", response.data);

            setDataFaculty(response.data);
        } catch (error) {
            console.error("Error fetching faculty data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Fetching faculty data... faculty_list");

        handleFetch();

        return () => {};
    }, [tableFilter]);

    const filterFaculty = debounce((field, value) => {
        setTableFilter((prevFilter) => ({ ...prevFilter, [field]: value }));
    }, 1000);

    const debouncedFilter = useCallback(
        (field, value) => {
            filterFaculty(field, value);
        },
        [filterFaculty]
    );

    const handleStatusFilter = (status) => {
        // setSelectedStatus(status);
        setTableFilter((prevFilter) => ({
            ...prevFilter,
            profile_status: status,
        }));
    };

    const resetFilters = () => {
        setTableFilter((ps) => ({
            ...ps,
            search: "",
            status: "All",
        }));
    };

    const statusMenu = [
        ...statuses.map((status) => ({
            key: status.value,
            label: status.label,
            onClick: () => handleStatusFilter(status.value),
        })),
    ];

    statusMenu.push({
        key: "divider",
        type: "divider",
    });

    statusMenu.push({
        key: "all",
        label: "All Statuses",
        onClick: () => handleStatusFilter("All Faculty"),
    });

    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const handleArchivedFaculty = async () => {
        setLoadingDelete(true);
        const apiUrl = window.location.origin;

        let data = {
            ids: selectedRowKeys,
            status: tableFilter.status,
        };

        try {
            let response = await axios.post(
                `${apiUrl}/api/profile_archived`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "auth_token"
                        )}`,
                    },
                }
            );

            console.log("Archived faculty response:", response);

            if (response.status === 200) {
                let res = response.data;

                if (res.success) {
                    handleFetch();
                    notification.success({
                        message: "Faculty",
                        description: res.message,
                    });
                    setSelectedRowKeys([]);
                } else {
                    notification.error({
                        message: "Faculty",
                        description: res.message,
                    });
                }
            } else {
                notification.error({
                    message: "Faculty",
                    description: "An error occurred: " + response.message,
                });
            }

            setLoadingDelete(false);
        } catch (error) {
            console.log("Error deleting faculty:", error);

            notification.error({
                message: "Faculty",
                description: "An error occurred: " + error.message,
            });
        } finally {
            setLoadingDelete(false);
        }
    };

    const columns = [
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (text, record) => {
                return (
                    <Flex gap={10} justify="center">
                        <Button
                            type="link"
                            onClick={() =>
                                setToggleModalForm({
                                    open: true,
                                    data: record,
                                })
                            }
                            icon={<EditOutlined />}
                        />
                    </Flex>
                );
            },
        },
        {
            title: "Created At",
            dataIndex: "created_at_format",
            key: "created_at_format",
        },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "First Name", dataIndex: "first_name", key: "first_name" },
        { title: "Last Name", dataIndex: "last_name", key: "last_name" },
        {
            title: "Middle Initial",
            dataIndex: "middle_initial",
            key: "middle_initial",
        },
        { title: "Suffix", dataIndex: "suffix", key: "suffix" },
        {
            title: "Sex",
            dataIndex: "sex",
            key: "sex",
            render: (text, record) => capitalizeFirstLetter(text),
        },
        {
            title: "Phone Number",
            dataIndex: "phone_number",
            key: "phone_number",
        },
        {
            title: "Religion",
            dataIndex: "religion",
            key: "religion",
            render: (text, record) => capitalizeFirstLetter(text),
        },
        {
            title: "Marital Status",
            dataIndex: "marital_status",
            key: "marital_status",
            render: (text, record) => capitalizeFirstLetter(text),
        },
        { title: "Department", dataIndex: "department", key: "department" },
        { title: "Address", dataIndex: "address", key: "address" },
        {
            title: "Status",
            key: "status",
            align: "center",
            render: (text, record) => record.user.status,
        },
    ];

    return (
        <MainDashboard>
            <div className="faculty-page">
                <Row gutter={[20, 20]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <h3>Faculty Management</h3>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Flex gap={10} wrap>
                            <Input.Search
                                placeholder="Search faculty..."
                                style={{ width: "100%", maxWidth: 300 }}
                                onSearch={(e) => {
                                    setTableFilter((prevFilter) => ({
                                        ...prevFilter,
                                        search: e,
                                    }));
                                }}
                                allowClear
                            />
                            <Dropdown
                                menu={{ items: statusMenu }}
                                trigger={["click"]}
                            >
                                <Button icon={<FilterOutlined />}>
                                    {tableFilter.profile_status ===
                                    "All Faculty"
                                        ? "Filter by Status"
                                        : `Status: ${
                                              statuses.find(
                                                  (x) =>
                                                      x.value ===
                                                      tableFilter.profile_status
                                              ).label
                                          }`}
                                </Button>
                            </Dropdown>
                            <Flex gap={5} wrap>
                                <Button
                                    type={
                                        tableFilter.status === "Active"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() =>
                                        setTableFilter((ps) => ({
                                            ...ps,
                                            status: "Active",
                                        }))
                                    }
                                >
                                    Active
                                </Button>
                                <Button
                                    type={
                                        tableFilter.status === "Archived"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() =>
                                        setTableFilter((ps) => ({
                                            ...ps,
                                            status: "Archived",
                                        }))
                                    }
                                >
                                    Archived
                                </Button>
                            </Flex>

                            <Button
                                onClick={resetFilters}
                                disabled={
                                    tableFilter.search === "" &&
                                    tableFilter.status === "All"
                                }
                            >
                                Reset Filters
                            </Button>
                        </Flex>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Flex gap={5} wrap justify={isMobile ? "start" : "end"}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() =>
                                    setToggleModalForm({
                                        open: true,
                                        data: null,
                                    })
                                }
                            >
                                Add Faculty
                            </Button>
                        </Flex>
                    </Col>
                    {selectedRowKeys.length > 0 && (
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Flex gap={10} wrap align="center">
                                <Text
                                    strong
                                    style={{
                                        marginBottom: "1px",
                                        display: "block",
                                    }}
                                >
                                    {selectedRowKeys.length} item(s) selected
                                </Text>

                                <Popconfirm
                                    title={`Are you sure to ${
                                        tableFilter.status === "Active"
                                            ? "archive"
                                            : "restore"
                                    } the selected ${
                                        selectedRowKeys.length > 0
                                            ? "faculties"
                                            : "faculty"
                                    }?`}
                                    onConfirm={() => handleArchivedFaculty()}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary" danger>
                                        {tableFilter.status === "Active"
                                            ? "Archive"
                                            : "Restore"}
                                    </Button>
                                </Popconfirm>
                            </Flex>
                        </Col>
                    )}

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Table
                            rowSelection={{
                                selectedRowKeys,
                                onChange: setSelectedRowKeys,
                            }}
                            dataSource={
                                dataFaculty &&
                                dataFaculty.data &&
                                dataFaculty.data.data
                                    ? dataFaculty.data.data
                                    : []
                            }
                            columns={columns}
                            rowKey="id"
                            loading={loading}
                            onChange={(pagination, filters, sorter) => {
                                setTableFilter((prevFilter) => ({
                                    ...prevFilter,
                                    sort_field: sorter.field,
                                    sort_order: sorter.order,
                                }));
                            }}
                        />
                    </Col>
                </Row>
            </div>

            <ModalFormFaculty
                toggleModalForm={toggleModalForm}
                setToggleModalForm={setToggleModalForm}
                handleFetch={handleFetch}
            />
        </MainDashboard>
    );
};

export default FacultyISPage;
