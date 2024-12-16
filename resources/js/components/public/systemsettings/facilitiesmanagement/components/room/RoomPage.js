// RoomPage.js
import React, { useState, useEffect } from "react";
import {
    Button,
    Input,
    Space,
    Typography,
    message,
    Popconfirm,
    Row,
    Col,
} from "antd";
import {
    FileTextOutlined,
    PlusOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import axios from "axios";
import RoomTable from "./components/RoomTable";
import { debounce } from "lodash"; // For debouncing search input
import RoomModal from "./components/RoomModal";

const RoomPage = () => {
    const [data, setData] = useState([]); // Active buildings
    const [archivedData, setArchivedData] = useState([]); // Archived buildings
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [toggleModalForm, setToggleModalForm] = useState({
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

    const [dataRoom, setDataRoom] = useState([]);
    const [dataFloor, setDataFloor] = useState([]);
    const [dataBuilding, setDataBuilding] = useState([]);

    useEffect(() => {
        const fetchBuilding = async () => {
            try {
                const apiUrl = window.location.origin;
                const token = localStorage.getItem("auth_token");

                // For active buildings only

                const response = await axios.get(apiUrl + "/api/building", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("building: ", response);

                setDataBuilding(response.data.data);
            } catch (err) {
                console.error("Error fetching buildings", err);
            }
        };

        fetchBuilding();

        const fetchFloor = async () => {
            try {
                const apiUrl = window.location.origin;
                const token = localStorage.getItem("auth_token");

                const response = await axios.get(apiUrl + "/api/floor", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("floor: ", response);

                setDataFloor(response.data.data);
            } catch (err) {
                console.error("Error fetching buildings", err);
            }
        };

        fetchFloor();

        return () => {};
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const apiUrl = window.location.origin;
            const token = localStorage.getItem("auth_token");
            if (!token) {
                message.error("Authorization token is missing");
                setLoading(false);
                return;
            }
            // For active buildings only

            const response = await axios.get(
                apiUrl + "/api/room?" + new URLSearchParams(tableFilter),
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setDataRoom(response.data);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching buildings", err);
            setError(err);
            setLoading(false);
            message.error("Failed to fetch buildings.");
        }
    };

    // Fetch building data using Axios
    useEffect(() => {
        fetchRooms();
    }, [tableFilter]); // Re-run the effect when `showArchived` changes

    const toggleArchivedView = () => {
        setShowArchived((prev) => !prev);
    };

    // Update filteredData based on searchValue and showArchived
    useEffect(() => {
        let baseData = showArchived ? archivedData : data;

        if (searchValue.trim() === "") {
            setFilteredData(baseData);
            return;
        }

        const isNumeric =
            !isNaN(searchValue.trim()) && searchValue.trim() !== "";

        let filtered;
        if (isNumeric) {
            // When numeric, search by ID (exact) AND Building Name (partial)
            const byID = baseData.filter(
                (building) => building.id.toString() === searchValue.trim()
            );

            const byName = baseData.filter(
                (building) =>
                    building.building_name &&
                    building.building_name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
            );

            const byIDIds = new Set(byID.map((b) => b.id));
            filtered = [...byID, ...byName.filter((b) => !byIDIds.has(b.id))];
        } else {
            // Non-numeric: Search by Building Name only
            filtered = baseData.filter(
                (building) =>
                    building.building_name &&
                    building.building_name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
            );
        }

        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    // **Debounced Search Handler**
    const debouncedHandleSearch = debounce((value) => {
        setSearchValue(value);
    }, 300); // 300ms debounce delay

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue("");
    };

    const handleDeleteBuilding = async (buildingId) => {
        try {
            const token = localStorage.getItem("auth_token");
            // Send DELETE request to backend
            await axios.delete(`/api/building/${buildingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Reload the data after successful deletion
            reloadData(); // Ensure you have the `reloadData` function to fetch fresh data
            message.success("Building deleted successfully");
        } catch (error) {
            message.error(
                "Failed to delete building: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };

    const handleDeleteSelected = async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            message.error("Authorization token is missing");
            return;
        }

        // Loop through each selected ID and send a DELETE request
        try {
            let data = {
                ids: selectedRowKeys,
                status: tableFilter.status,
            };

            let response = await axios.post(`/api/room_archived`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                let res = response.data;

                if (res.success) {
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

            // Clear the selected row keys
            setSelectedRowKeys([]);
        } catch (error) {
            notification.error({
                message: "Room",
                description: "An error occurred: " + JSON.stringify(error),
            });
        }
    };

    const handleRestoreSelected = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            console.log("Selected IDs for Restore:", selectedRowKeys); // Log the selected IDs

            // Ensure selectedRowKeys is an array and not null/undefined
            const validSelectedRowKeys = Array.isArray(selectedRowKeys)
                ? selectedRowKeys
                : [];

            if (validSelectedRowKeys.length === 0) {
                message.warning("No rows selected for restore.");
                return;
            }

            // Send a POST request for each selected building
            const restorePromises = validSelectedRowKeys.map(async (id) => {
                return axios.post(
                    `/api/building/${id}/restore`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            });

            // Wait for all requests to finish
            await Promise.all(restorePromises);

            // Reload the data after restore
            reloadData();

            // Update the data on the frontend once all buildings are restored
            const newData = data.map((building) =>
                validSelectedRowKeys.includes(building.id)
                    ? { ...building, deleted_at: null }
                    : building
            );
            setData(newData); // Update the state with restored buildings
            message.success(
                `${validSelectedRowKeys.length} building(s) restored`
            );
        } catch (error) {
            message.error(
                "Failed to restore buildings: " +
                    (error.response?.data?.message || error.message)
            );
        } finally {
            setSelectedRowKeys([]); // Reset selected rows after operation
        }
    };

    // **Updated handleCreateBuilding with Duplicate Check**
    const handleCreateBuilding = async (values) => {
        try {
            const token = localStorage.getItem("auth_token");

            if (!token) {
                message.error("Authorization token is missing");
                return;
            }

            // **Duplicate Check**
            const duplicate =
                data.some(
                    (building) =>
                        building.building_name.toLowerCase() ===
                        values.building_name.trim().toLowerCase()
                ) ||
                archivedData.some(
                    (building) =>
                        building.building_name.toLowerCase() ===
                        values.building_name.trim().toLowerCase()
                );

            if (duplicate) {
                message.error("A building with this name already exists.");
                return; // Prevent further execution
            }

            setLoading(true);

            const response = await axios.post("/api/building", values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData((prevData) => [...prevData, response.data.building]);
            setIsCreateModalVisible(false);
            message.success("Building created successfully");
            reloadData();
        } catch (error) {
            setError(error.message);
            message.error("Failed to create building");
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreBuilding = async (id) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await axios.post(
                `/api/building/${id}/restore`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Reload data to reflect changes after restoration
            reloadData();
            message.success("Building restored successfully");
        } catch (error) {
            message.error(
                "Failed to restore building: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };

    // **handleEditBuilding Function with Duplicate Check**
    const handleEditBuilding = async (id, updatedValues) => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                message.error("Authorization token is missing");
                return;
            }

            // **Duplicate Check**
            const duplicate =
                data.some(
                    (building) =>
                        building.building_name.toLowerCase() ===
                            updatedValues.building_name.trim().toLowerCase() &&
                        building.id !== id
                ) ||
                archivedData.some(
                    (building) =>
                        building.building_name.toLowerCase() ===
                            updatedValues.building_name.trim().toLowerCase() &&
                        building.id !== id
                );

            if (duplicate) {
                message.error("A building with this name already exists.");
                return; // Prevent further execution
            }

            setLoading(true);

            const response = await axios.put(
                `/api/building/${id}`,
                updatedValues,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updatedData = data.map((building) =>
                building.id === id
                    ? { ...building, ...response.data.building }
                    : building
            );
            setData(updatedData);
            setIsEditModalVisible(false);
            message.success("Building updated successfully");
            reloadData();
        } catch (error) {
            message.error("Failed to update building");
        } finally {
            setLoading(false);
        }
    };

    // Print functionality
    const printTable = () => {
        const printWindow = window.open("", "", "height=650, width=900");
        if (!printWindow) return; // If popup blocked

        printWindow.document.write(
            "<html><head><title>Building Table</title></head><body>"
        );
        printWindow.document.write("<h2>Building Table</h2>");
        printWindow.document.write(
            '<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">'
        );
        printWindow.document.write(
            "<thead><tr><th>Building Name</th><th>Created</th><th>Updated</th></tr></thead>"
        );
        printWindow.document.write("<tbody>");
        filteredData.forEach((item) => {
            printWindow.document.write("<tr>");
            printWindow.document.write(`<td>${item.building_name ?? ""}</td>`);
            // printWindow.document.write(`<td>${item.floor_name ?? ''}</td>`); // Assuming floor_name is available
            const createdAtValue = item.created_at
                ? new Date(item.created_at).toLocaleString()
                : "";
            const updatedAtValue = item.updated_at
                ? new Date(item.updated_at).toLocaleString()
                : "";
            printWindow.document.write(`<td>${createdAtValue}</td>`);
            printWindow.document.write(`<td>${updatedAtValue}</td>`);
            printWindow.document.write("</tr>");
        });
        printWindow.document.write("</tbody>");
        printWindow.document.write("</table>");
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div style={{ padding: "20px", background: "#fff" }}>
            <Row gutter={[20, 0]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div
                        style={{
                            marginBottom: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <Space wrap style={{ display: "flex", gap: "10px" }}>
                            <Input.Search
                                value={searchValue}
                                placeholder="Search by Building Name or ID"
                                style={{ minWidth: "200px", maxWidth: "300px" }}
                                onSearch={handleSearch}
                                onChange={(e) =>
                                    debouncedHandleSearch(e.target.value)
                                }
                                allowClear
                            />
                            <Button
                                icon={<FileTextOutlined />}
                                onClick={printTable}
                            >
                                Print
                            </Button>
                            <Button
                                icon={<UnorderedListOutlined />}
                                onClick={() => {
                                    setTableFilter((ps) => ({
                                        ...ps,
                                        status:
                                            ps.status === "Active"
                                                ? "Archived"
                                                : "Active",
                                    }));
                                }}
                            >
                                {tableFilter.status === "Active"
                                    ? "Show Active Buildings"
                                    : "Show Archived Buildings"}
                            </Button>
                        </Space>

                        {/* Action buttons container */}
                        <Space wrap style={{ display: "flex", gap: "10px" }}>
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
                                Create Room
                            </Button>
                        </Space>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div>
                        {selectedRowKeys.length > 0 && (
                            <Popconfirm
                                title={`Are you sure you want to ${
                                    tableFilter.status === "Active"
                                        ? "archived"
                                        : "restore"
                                } the selected floors?`}
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger={tableFilter.status === "Active"}
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    {tableFilter.status === "Active"
                                        ? "Archive"
                                        : "Restore"}
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                </Col>
            </Row>
            {/* Search and Buttons container */}

            <RoomTable
                data={dataRoom}
                setToggleModalForm={setToggleModalForm}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                tableFilter={tableFilter}
                setTableFilter={setTableFilter}
                loading={loading}
            />
            <RoomModal
                toggleModalForm={toggleModalForm}
                setToggleModalForm={setToggleModalForm}
                fetchRooms={fetchRooms}
                dataBuilding={dataBuilding}
                dataFloor={dataFloor}
            />
        </div>
    );
};

export default RoomPage;
