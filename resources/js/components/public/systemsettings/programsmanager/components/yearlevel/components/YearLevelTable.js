import React, { useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const YearLevelTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteYearLevel,
    handleRestoreYearLevel,
    loading,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page when the page is changed
    };

    const yearLevelMap = {
        1: 'First Year',
        2: 'Second Year',
        3: 'Third Year',
        4: 'Fourth Year',
        5: 'Fifth Year',
        6: 'Sixth Year',
        7: 'Seventh Year',
        8: 'Eighth Year',
        9: 'Ninth Year',
        10: 'Tenth Year',
    };

    const columns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>, // Blue title
            key: 'actions',
            render: (_, record) => (
                 <Space size="middle">
                    {/* Show the Edit button */}
                    <Button
                        icon={<EditOutlined />}
                        style={{ backgroundColor: '#1677FF', borderColor: '#1677FF', color: '#fff' }}
                        onClick={() => {
                            setIsEditModalVisible(true);
                            setModalData(record); // Pass the record data to the modal for editing
                        }}
                        aria-label={`Edit year level ${record.year_level}`}
                    />
                    
                    {/* Show Delete button only if not archived */}
                    {!record.deleted_at && (
                        <Popconfirm
                            title="Are you sure you want to delete this year level?"
                            onConfirm={() => handleDeleteYearLevel(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                            />
                        </Popconfirm>
                    )}

                    {/* Show Restore button only if archived */}
                    {record.deleted_at && (
                        <Popconfirm
                            title="Are you sure you want to restore this year level?"
                            onConfirm={() => handleRestoreYearLevel(record.id)}  // Trigger restore with year level ID
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<ReloadOutlined />}
                                style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                            >
                                Restore
                            </Button>
                        </Popconfirm>
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
            title: <span style={{ color: '#1890ff' }}>Year Level</span>, // Title for the column
            dataIndex: 'year_level', // The field in your data to show
            key: 'year_level',
            render: (text) => yearLevelMap[text] || text,
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
                id="year-level-table"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)} // Paginate the data
                rowKey="id" // Ensure each row is keyed by the unique year level ID
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: data.length,
                    onChange: handlePageChange, // Update the page when changed
                    position: ['topRight'], // Pagination only at the top-right
                }}
                footer={() => (
                    <div style={{ textAlign: 'left' }}>
                        {/* Page Info at Bottom Left */}
                        <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                    </div>
                )}
                scroll={{ x: 800 }} // Allows horizontal scrolling on smaller screens if needed
                loading={{
                    spinning: loading, // Controls if the table should show loading spinner
                    indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, // Custom loading indicator (optional)
                    tip: "Loading data..." // Loading message
                }}
            />
    );
};

export default YearLevelTable;
