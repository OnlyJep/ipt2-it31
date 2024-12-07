// UserTable.js
import React, { useState } from 'react';
import { Table, Space, Button, Card, List, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const { Text } = Typography;

const UserTable = ({
    data,
    rowSelection, // Retain this for bulk actions
    setIsEditModalVisible,
    setModalData,
    handleDelete, // Single delete logic passed from parent
    handleRestore,
}) => {
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const pageSize = 5; // Define the page size

    const isMobile = useMediaQuery({ maxWidth: 767 }); // Define mobile breakpoint

    const handleEdit = (record) => {
        setModalData(record);
        setIsEditModalVisible(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page when the page is changed
    };

    const columns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>,
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {/* Edit Button */}
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                        aria-label="Edit User"
                    />

                    {/* Delete Button */}
                    {!record.archived && (
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)} // Directly delete using ID
                            size="small"
                            aria-label="Delete User"
                        />
                    )}

                    {/* Restore Button */}
                    {record.archived && (
                        <Button
                            type="default"
                            icon={<ReloadOutlined />}
                            onClick={() => handleRestore(record.id)}
                            size="small"
                            aria-label="Restore User"
                        >
                            Restore
                        </Button>
                    )}
                </Space>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'], // Visible on all screen sizes
        },
        {
            title: <span style={{ color: '#1890ff' }}>ID</span>,
            dataIndex: 'id',
            key: 'id',
            responsive: ['sm', 'md', 'lg', 'xl'], // Hidden on extra small screens
        },
        {
            title: <span style={{ color: '#1890ff' }}>Status</span>,
            dataIndex: 'status',
            key: 'status',
            render: (status) => (status === 'active' ? 'Active' : 'Archived'), // Display status as "Active" or "Archived"
            responsive: ['md', 'lg', 'xl'], // Hidden on small and extra small screens
        },
        {
            title: <span style={{ color: '#1890ff' }}>Username</span>,
            dataIndex: 'username',
            key: 'username',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'], // Visible on all screen sizes
        },
        {
            title: <span style={{ color: '#1890ff' }}>Password</span>,
            dataIndex: 'password',
            key: 'password',
            render: () => '******', // Mask the password
            responsive: ['lg', 'xl'], // Hidden on small and extra small screens
        },
        {
            title: <span style={{ color: '#1890ff' }}>Role</span>,
            key: 'role',
            dataIndex: 'role_name', // Assuming 'role_name' is the correct data index
            render: (text, record) => (record.role ? record.role.role_name : 'No Role'),
            responsive: ['sm', 'md', 'lg', 'xl'], // Hidden on extra small screens
        },
        {
            title: <span style={{ color: '#1890ff' }}>Email</span>,
            dataIndex: 'email',
            key: 'email',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'], // Visible on all screen sizes
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created</span>,
            dataIndex: 'created_at',
            key: 'created',
            responsive: ['lg', 'xl'], // Hidden on small and extra small screens
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated</span>,
            dataIndex: 'updated_at',
            key: 'updated',
            responsive: ['lg', 'xl'], // Hidden on small and extra small screens
        },
    ];

    // Conditional Rendering for Mobile: Render as Cards
    if (isMobile) {
        return (
            <List
                dataSource={data}
                bordered
                renderItem={(item) => (
                    <List.Item>
                        <Card style={{ width: '100%' }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <Text strong>ID:</Text> {item.id}
                                <Text strong>Username:</Text> {item.username}
                                <Text strong>Email:</Text> {item.email}
                                <Text strong>Status:</Text> {item.status === 'active' ? 'Active' : 'Archived'}
                                <Text strong>Role:</Text> {item.role ? item.role.role_name : 'No Role'}
                                {/* Add more fields as necessary */}
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEdit(item)}
                                        size="small"
                                        aria-label="Edit User"
                                    />
                                    {!item.archived && (
                                        <Button
                                            type="danger"
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDelete(item.id)}
                                            size="small"
                                            aria-label="Delete User"
                                        />
                                    )}
                                    {item.archived && (
                                        <Button
                                            type="default"
                                            icon={<ReloadOutlined />}
                                            onClick={() => handleRestore(item.id)}
                                            size="small"
                                            aria-label="Restore User"
                                        >
                                            Restore
                                        </Button>
                                    )}
                                </Space>
                            </Space>
                        </Card>
                    </List.Item>
                )}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: data.length,
                    onChange: handlePageChange,
                    position: ['bottomCenter'], // Pagination at the bottom center for mobile
                }}
                style={{ marginBottom: 16 }}
            />
        );
    }

    return (
        <Table
            rowSelection={rowSelection} // Still supports bulk operations
            columns={columns}
            dataSource={data}
            bordered
            pagination={{
                current: currentPage, // Current page number
                pageSize: pageSize, // Page size
                total: data.length, // Total number of items
                onChange: handlePageChange, // Update the page when changed
                position: ['topRight'], // Pagination only at the top-right
            }}
            style={{ color: '#000' }}
            rowKey="id" // Use 'id' as a unique key
            scroll={{ x: 'max-content' }} // Enables horizontal scroll if needed
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    {/* Page Info at Bottom Left */}
                    Page {currentPage} of {Math.ceil(data.length / pageSize)}
                </div>
            )}
        />
    );
};

export default UserTable;
