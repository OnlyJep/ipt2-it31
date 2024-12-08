// BuildingTable.js (Updated to Use Dynamic Data and Enhanced Search)
import React, { useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const BuildingTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteBuilding,
    handleRestoreBuilding,
    loading, // Receive loading state from parent
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page when the page is changed
    };
    

    const columns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>, // Blue title
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        style={{ backgroundColor: '#1677FF', borderColor: '#1677FF', color: '#fff' }}
                        onClick={() => {
                            setIsEditModalVisible(true);
                            setModalData(record);
                        }}
                        aria-label={`Edit building ${record.building_name}`} // ARIA label for accessibility
                    />
                    
                    {/* Show delete button for active buildings (deleted_at is null) */}
                    {record.deleted_at === null && (
                        <Popconfirm
                            title="Are you sure to delete this building?"
                            onConfirm={() => handleDeleteBuilding(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                type="danger"
                                aria-label={`Delete building ${record.building_name}`} // ARIA label for accessibility
                            />
                        </Popconfirm>
                    )}
                    
                    {/* Show restore button for archived buildings (deleted_at is not null) */}
                    {record.deleted_at !== null && (
                        <Button
                            icon={<ReloadOutlined />}
                            type="default"
                            onClick={() => handleRestoreBuilding(record.id)} // Handle restore action
                            aria-label={`Restore building ${record.building_name}`} // ARIA label for accessibility
                        >
                            Restore
                        </Button>
                    )}
                </Space>
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>ID</span>, // Blue title
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Building Name</span>, // Blue title
            dataIndex: 'building_name',
            key: 'building_name',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Floor ID</span>, // Blue title
            dataIndex: 'floor_id',
            key: 'floor_id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created At</span>, // Blue title
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => (
                <Text>{new Date(text).toLocaleString()}</Text> // Format the date
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated At</span>, // Blue title
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => (
                <Text>{new Date(text).toLocaleString()}</Text> // Format the date
            ),
        },
    ];

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data} // Data from the backend, may be empty
            rowKey="id" // Ensure each row is keyed by the unique building ID
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: data.length, // Set to 0 if no data available
                onChange: handlePageChange, // Update page on change
                position: ['topRight'], // Pagination on the top-right
                hideOnSinglePage: true, // Hide pagination if there's only one page
            }}
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    {/* Page Info at Bottom Left */}
                    <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                </div>
            )}
            scroll={{ x: 1200 }} // Allow horizontal scrolling if needed
            loading={{
                spinning: loading, // Controls if the table should show loading spinner
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, // Custom loading indicator (optional)
                tip: "Loading data..." // Loading message
            }} // Show loading spinner when data is being fetched
            locale={{
                emptyText: loading ? 'Loading Buildings...' : 'No Buildings Found.', // Show loading or empty message
            }}
        />

    );
};

export default BuildingTable;
