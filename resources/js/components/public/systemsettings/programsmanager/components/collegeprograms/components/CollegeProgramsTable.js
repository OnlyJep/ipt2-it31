// CollegeProgramsTable.js
import React from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CollegeProgramsTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteProgram,
    handleRestoreCollegeProgram, // Handler for restoring a college program
    currentPage,
    pageSize,
    setCurrentPage,
    showArchived,
    loading
}) => {

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page when the page is changed
    };

    // Handle edit action
    const handleEdit = (record) => {
        setModalData(record);
        setIsEditModalVisible(true);
    };

    // Define table columns
    const baseColumns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>, // Blue title
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {!record.isArchived ? (
                        <>
                            <Button
                                icon={<EditOutlined />}
                                style={{ backgroundColor: '#1677FF', borderColor: '#1677FF', color: '#fff' }}
                                onClick={() => handleEdit(record)}
                            />
                            <Popconfirm
                            title="Are you sure you want to delete this year level?"
                            onConfirm={() => handleDeleteProgram(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                            />
                            </Popconfirm>
                        </>
                    ) : (
                        <Popconfirm
                            title="Are you sure you want to restore this year level?"
                            onConfirm={() => handleRestoreCollegeProgram(record.id)}  // Trigger restore with year level ID
                            okText="Yes"
                            cancelText="No"
                        >
                        <Button
                            icon={<ReloadOutlined />}
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
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
            title: <span style={{ color: '#1890ff' }}>College Program</span>, // Blue title
            dataIndex: 'college_programs',
            key: 'college_programs',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Study Type</span>, // Blue title
            dataIndex: 'study_type',
            key: 'study_type',
        },
    ];

    // Additional columns based on view
    const extraColumns = showArchived
        ? [
            {
                title: <span style={{ color: '#1890ff' }}>Deleted At</span>, // Blue title
                dataIndex: 'deleted_at',
                key: 'deleted_at',
                render: (value) => value ? new Date(value).toLocaleString() : 'None'
            }
        ]
        : [
            {
                title: <span style={{ color: '#1890ff' }}>Created At</span>, // Blue title
                dataIndex: 'created_at',
                key: 'created_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> // Format the date
                ),
            },
            {
                title: <span style={{ color: '#1890ff' }}>Updated At</span>, // Blue title
                dataIndex: 'updated_at',
                key: 'updated_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> // Format the date
                ),
            },
        ];

    // Combine all columns
    const columns = [...baseColumns, ...extraColumns];

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data} // Data is already filtered and managed by parent
            rowKey="id" // Ensure each row is keyed by the unique college program ID
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: data.length,
                onChange: handlePageChange, // Update the page when changed
                position: ['topRight'],
                showSizeChanger: false, // Hide page size changer if handled server-side
            }}
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    {/* Page Info at Bottom Left */}
                    <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                </div>
            )}
            scroll={{ x: 800 }} // Allows horizontal scrolling on smaller screens if needed
            loading={loading}
            bordered
        />
    );
};

export default CollegeProgramsTable;
