// AnnouncementTable.js
import React from 'react';
import { Table, Button, Space, Typography, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Text } = Typography;

const AnnouncementTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteAnnouncement,
    handleRestoreAnnouncement, // New prop for restoring
    currentPage,
    pageSize,
    setCurrentPage,
    showArchived,
    loading,
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
                    {!record.isArchived ? (
                        <>
                            <Tooltip title="Edit Announcement">
                                <Button
                                    icon={<EditOutlined />}
                                    style={{ backgroundColor: '#1677FF', borderColor: '#1677FF', color: '#fff' }}
                                    onClick={() => handleEdit(record)}
                                />
                            </Tooltip>
                            <Popconfirm
                                title="Are you sure you want to archive this announcement?"
                                onConfirm={() => handleDeleteAnnouncement(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Tooltip title="Archive Announcement">
                                    <Button
                                        icon={<DeleteOutlined />}
                                        danger
                                        style={{ border: 'none', color: '#000000' }}
                                    />
                                </Tooltip>
                            </Popconfirm>
                        </>
                    ) : (
                        <Popconfirm
                            title="Are you sure you want to restore this announcement?"
                            onConfirm={() => handleRestoreAnnouncement(record.id)}  // Trigger restore with announcement ID
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip title="Restore Announcement">
                                <Button
                                    icon={<ReloadOutlined />}
                                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                                >
                                    Restore
                                </Button>
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>ID</span>, // Blue title
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id, // Optional: Add sorting
        },
        {
            title: <span style={{ color: '#1890ff' }}>Announcement</span>, // Blue title
            dataIndex: 'announcement',
            key: 'announcement',
            sorter: (a, b) => a.announcement.localeCompare(b.announcement), // Optional: Add sorting
            render: (text) => (
                <Text>{text}</Text> // Display the announcement text
            ),
        },
    ];

    const extraColumns = showArchived
        ? [
            {
                title: <span style={{ color: '#1890ff' }}>Deleted At</span>, // Blue title
                dataIndex: 'deleted_at',
                key: 'deleted_at',
                render: (value) => (value ? new Date(value).toLocaleString() : 'N/A'),
                sorter: (a, b) => new Date(a.deleted_at) - new Date(b.deleted_at), // Optional: Add sorting
            },
        ]
        : [
            {
                title: <span style={{ color: '#1890ff' }}>Created At</span>, // Blue title
                dataIndex: 'created_at',
                key: 'created_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> // Format the date
                ),
                sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at), // Optional: Add sorting
            },
            {
                title: <span style={{ color: '#1890ff' }}>Updated At</span>, // Blue title
                dataIndex: 'updated_at',
                key: 'updated_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> // Format the date
                ),
                sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at), // Optional: Add sorting
            },
        ];

    const columns = [...baseColumns, ...extraColumns];

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data} // Data is already filtered and managed by parent
            rowKey="id" // Ensure each row is keyed by the unique announcement ID
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
            scroll={{ x: 'max-content' }} // Allows horizontal scrolling on smaller screens if needed
            loading={{
                spinning: loading, // Controls if the table should show loading spinner
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, // Custom loading indicator (optional)
                tip: "Loading data..." // Loading message
            }}
            bordered
            locale={{
                emptyText: showArchived
                    ? 'No archived announcements available.'
                    : 'No active announcements available.',
            }}
        />
    );
};

AnnouncementTable.propTypes = {
    rowSelection: PropTypes.object,
    data: PropTypes.array.isRequired,
    setIsEditModalVisible: PropTypes.func.isRequired,
    setModalData: PropTypes.func.isRequired,
    handleDeleteAnnouncement: PropTypes.func.isRequired,
    handleRestoreAnnouncement: PropTypes.func.isRequired, // Ensure this prop is received
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    showArchived: PropTypes.bool.isRequired,
    //loading: PropTypes.bool.isRequired,
};

export default AnnouncementTable;
