import React, { useState } from 'react';
import { Table, Space, Button, Card, List, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, PrinterOutlined } from '@ant-design/icons';
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
            render: (status) => {
                switch (status) {
                    case 'active':
                        return 'Active';
                    case 'archived':
                        return 'Archived';
                    case 'regular':
                        return 'Regular';
                    case 'irregular':
                        return 'Irregular';
                    default:
                        return 'Unknown'; // Optional fallback for unexpected statuses
                }
            },
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

    const printTable = () => {
        const printWindow = window.open('', '', 'height=650, width=900');
        printWindow.document.write('<html><head><title>User Table</title></head><body>');
        printWindow.document.write('<h2>User Table</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">');
        printWindow.document.write('<thead><tr><th>ID</th><th>Status</th><th>Username</th><th>Role</th><th>Email</th><th>Created</th><th>Updated</th></tr></thead>');
        printWindow.document.write('<tbody>');
        data.forEach((item) => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${item.id}</td>`);
            printWindow.document.write(`<td>${item.status === 'active' ? 'Active' :
                item.status === 'archived' ? 'Archived' :
                item.status === 'regular' ? 'Regular' : 'Irregular'}</td>`);
            printWindow.document.write(`<td>${item.username}</td>`);
            printWindow.document.write(`<td>${item.role ? item.role.role_name : 'No Role'}</td>`);
            printWindow.document.write(`<td>${item.email}</td>`);
            printWindow.document.write(`<td>${item.created_at}</td>`);
            printWindow.document.write(`<td>${item.updated_at}</td>`);
            printWindow.document.write('</tr>');
        });
        printWindow.document.write('</tbody>');
        printWindow.document.write('</table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <>
            {/* Print Button Rendered Always */}
            <Button
                icon={<PrinterOutlined />}
                type="primary"
                onClick={printTable}
                style={{ marginBottom: 16 }}
                aria-label="Print Table"
            >
                Print Table
            </Button>

            {isMobile ? (
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
                                    <Text strong>Status:</Text> {
                                        item.status === 'active' ? 'Active' :
                                        item.status === 'archived' ? 'Archived' :
                                        item.status === 'regular' ? 'Regular' :
                                        item.status === 'irregular' ? 'Irregular' :
                                        'Unknown'  // Optional fallback in case of an unknown status value
                                    }
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
            ) : (
                <Table
                    id="user-table" // Make sure to add this line
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                    bordered
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: data.length,
                        onChange: handlePageChange,
                        position: ['topRight'],
                    }}
                    style={{ color: '#000' }}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    footer={() => (
                        <div style={{ textAlign: 'left' }}>
                            Page {currentPage} of {Math.ceil(data.length / pageSize)}
                        </div>
                    )}
                />
            )}
        </>
    );
};

export default UserTable;
