// RoomTable.js (Updated to Use Dynamic Data and Enhanced Search)
import React, { useState } from "react";
import { Table, Button, Space, Typography, Popconfirm } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const RoomTable = ({
    data,
    loading, // Receive loading state from parent
    setToggleModalForm,
    selectedRowKeys,
    setSelectedRowKeys,
    tableFilter,
    setTableFilter,
}) => {
    console.log("tableFilter:", tableFilter);

    const columns = [
        {
            title: <span style={{ color: "#1890ff" }}>Actions</span>, // Blue title
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        style={{
                            backgroundColor: "#1677FF",
                            borderColor: "#1677FF",
                            color: "#fff",
                        }}
                        onClick={() => {
                            setToggleModalForm({
                                open: true,
                                data: record,
                            });
                        }}
                    />
                </Space>
            ),
        },

        {
            title: <span style={{ color: "#1890ff" }}>Room Code</span>, // Blue title
            dataIndex: "room_code",
            key: "room_code",
        },
        {
            title: <span style={{ color: "#1890ff" }}>Building Name</span>, // Blue title
            dataIndex: "building_name",
            key: "building_name",
        },
        {
            title: <span style={{ color: "#1890ff" }}>Floor Level</span>, // Blue title
            dataIndex: "floor_level",
            key: "floor_level",
        },
        // {
        //     title: <span style={{ color: '#1890ff' }}>Maximum Floor</span>, // Blue title
        //     dataIndex: 'floor_level', // Use 'floor_level' from the data
        //     key: 'floor',
        //     render: (text, record) => getOrdinalFloor(record.floor ? record.floor.floor_level : null),  // Show ordinal floor or 'No Floor' if not available
        // },
        {
            title: <span style={{ color: "#1890ff" }}>Created At</span>, // Blue title
            dataIndex: "created_at",
            key: "created_at",
            render: (text) => (
                <Text>{new Date(text).toLocaleString()}</Text> // Format the date
            ),
        },
        {
            title: <span style={{ color: "#1890ff" }}>Updated At</span>, // Blue title
            dataIndex: "updated_at",
            key: "updated_at",
            render: (text) => (
                <Text>{new Date(text).toLocaleString()}</Text> // Format the date
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={
                data && data.data && data.data.data ? data.data.data : []
            } // Data from the backend, may be empty
            rowKey="id" // Ensure each row is keyed by the unique building ID
            pagination={{
                current: tableFilter.page, // Set the current page
                pageSize: tableFilter.page_size, // Set the page size
                total: data.length, // Set to 0 if no data available
                onChange: (page, pageSize) => {
                    setTableFilter({
                        ...tableFilter,
                        page,
                        page_size: pageSize,
                    });
                }, // Update page on change
                position: ["topRight"], // Pagination on the top-right
                hideOnSinglePage: true, // Hide pagination if there's only one page
            }}
            rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
            }}
            footer={() => (
                <div style={{ textAlign: "left" }}>
                    {/* Page Info at Bottom Left */}
                    <Text>{`Page ${tableFilter.page} of ${
                        data.length > 0
                            ? Math.ceil(
                                  data.length / Number(tableFilter.page_size)
                              )
                            : 1
                    }`}</Text>
                </div>
            )}
            scroll={{ x: 1200 }} // Allow horizontal scrolling if needed
            loading={{
                spinning: loading, // Controls if the table should show loading spinner
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, // Custom loading indicator (optional)
                tip: "Loading data...", // Loading message
            }} // Show loading spinner when data is being fetched
            locale={{
                emptyText: loading
                    ? "Loading Buildings..."
                    : "No Buildings Found.", // Show loading or empty message
            }}
        />
    );
};

export default RoomTable;
