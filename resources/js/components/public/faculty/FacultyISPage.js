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
} from "antd";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";
import MainDashboard from "../dashboard/components/MainDashboard";

const { Text } = Typography;

const FacultyISPage = () => {
    // Static data for faculty
    const facultyData = [
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            middleInitial: "A.",
            sex: "Male",
            phoneNumber: "123-456-7890",
            suffix: "Jr.",
            photoPath: "/path/to/photo.jpg",
            religion: "Christianity",
            maritalStatus: "Married",
            address: "123 Main St",
            status: "Active",
            email: "john.doe@example.com",
        },
        // Add more faculty members as needed
    ];

    const statuses = [
        { id: 1, name: "Active" },
        { id: 2, name: "Inactive" },
        { id: 3, name: "On Leave" },
    ];

    const [dataFaculty, setDataFaculty] = useState([]);
    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "created_at_format",
        sort_order: "desc",
        status: "All",
    });
    const [searchValue, setSearchValue] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 767);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        console.log("Fetching faculty data... faculty_list");

        const handleFetch = async () => {
            const apiUrl = window.location.origin;
            try {
                setLoading(true);
                const response = await axios.get(
                    `${apiUrl}/api/faculty_list?${new URLSearchParams(
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
                console.log("Faculty data:", response.data);

                setDataFaculty(response.data);
            } catch (error) {
                console.error("Error fetching faculty data:", error);
            } finally {
                setLoading(false);
            }
        };

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
            status: status,
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
            key: status.id,
            label: status.name,
            onClick: () => handleStatusFilter(status.name),
        })),
    ];

    statusMenu.push({
        key: "divider",
        type: "divider",
    });

    statusMenu.push({
        key: "all",
        label: "All Statuses",
        onClick: () => handleStatusFilter("All"),
    });

    const columns = [
        { title: "First Name", dataIndex: "first_name", key: "first_name" },
        { title: "Last Name", dataIndex: "last_name", key: "last_name" },
        {
            title: "Middle Initial",
            dataIndex: "middle_initial",
            key: "middle_initial",
        },
        { title: "Suffix", dataIndex: "suffix", key: "suffix" },
        { title: "Sex", dataIndex: "sex", key: "sex" },
        { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
        { title: "Religion", dataIndex: "religion", key: "religion" },
        {
            title: "Marital Status",
            dataIndex: "maritalStatus",
            key: "maritalStatus",
        },
        { title: "Address", dataIndex: "address", key: "address" },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "Email", dataIndex: "email", key: "email" },
    ];

    return (
        <MainDashboard>
            <div className="faculty-page">
                <Space direction="vertical" style={{ width: "100%" }}>
                    <h3>Faculty Management</h3>
                    <Row
                        gutter={[16, 16]}
                        justify="space-between"
                        align="middle"
                    >
                        <Col xs={24} sm={24} md={12}>
                            <Space wrap>
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
                                        {selectedStatus === "All"
                                            ? "Filter by Status"
                                            : `Status: ${selectedStatus}`}
                                    </Button>
                                </Dropdown>
                            </Space>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={12}
                            style={{ textAlign: isMobile ? "left" : "right" }}
                        >
                            <Space>
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Add Faculty
                                </Button>
                                <Popconfirm
                                    title="Are you sure to remove the selected faculty?"
                                    onConfirm={() =>
                                        console.log("Remove faculty")
                                    }
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        disabled={selectedRowKeys.length === 0}
                                    >
                                        Remove
                                    </Button>
                                </Popconfirm>
                            </Space>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                onClick={resetFilters}
                                disabled={
                                    tableFilter.search === "" &&
                                    selectedStatus === "All"
                                }
                                style={{ marginTop: 10 }}
                            >
                                Reset Filters
                            </Button>
                        </Col>
                    </Row>
                    {selectedRowKeys.length > 0 && (
                        <Text
                            strong
                            style={{ marginBottom: "1px", display: "block" }}
                        >
                            {selectedRowKeys.length} item(s) selected
                        </Text>
                    )}
                    {console.log("dataFaculty: ", dataFaculty)}
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
                    />
                </Space>
            </div>
        </MainDashboard>
    );
};

export default FacultyISPage;
