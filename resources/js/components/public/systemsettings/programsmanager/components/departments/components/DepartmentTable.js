// DepartmentTable.js
import React from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DepartmentTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteDepartment,
    handleRestoreDepartment, // Ensure this prop is received
    currentPage,
    pageSize,
    setCurrentPage,
    showArchived,
    loading
}) => {

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page when the page is changed
    };

    const handleEdit = (record) => {
        setModalData(record);
        setIsEditModalVisible(true);
    };

    const baseColumns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>, // Blue title
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {!record.isArchived && (
                        <>
                            <Button
                                icon={<EditOutlined />}
                                style={{ backgroundColor: '#1677FF', borderColor: '#1677FF', color: '#fff' }}
                                onClick={() => handleEdit(record)}
                            />
                            <Popconfirm
                            title="Are you sure you want to delete this department?"
                            onConfirm={() => handleDeleteDepartment(record.id)}
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
                    )}
                    {record.isArchived && (
                        <Popconfirm
                        title="Are you sure you want to restore this department?"
                        onConfirm={() => handleRestoreDepartment(record.id)}  // Trigger restore with year level ID
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
            title: <span style={{ color: '#1890ff' }}>Department Name</span>, // Blue title
            dataIndex: 'department_name',
            key: 'department_name',
        },
    ];

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

    const columns = [...baseColumns, ...extraColumns];

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data} // Data is already filtered and managed by parent
            rowKey="id" // Ensure each row is keyed by the unique department ID
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
            loading={{
                spinning: loading, // Controls if the table should show loading spinner
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, // Custom loading indicator (optional)
                tip: "Loading data..." // Loading message
            }}
            bordered
        />
    );
};

export default DepartmentTable;
