// PostEventTable.js
import React from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment'; // Ensure moment is installed: npm install moment

const { Text } = Typography;

const PostEventTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteEvent,
    handleRestoreEvent, // Ensure this prop is received
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

    const columns = [
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
                                aria-label={`Edit event ${record.event_name}`}
                            />
                            <Popconfirm
                                title="Are you sure you want to archive this event?"
                                onConfirm={() => handleDeleteEvent(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    icon={<DeleteOutlined />}
                                    danger
                                    style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                                    aria-label={`Archive event ${record.event_name}`}
                                />
                            </Popconfirm>
                        </>
                    )}
                    {record.isArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore this event?"
                            onConfirm={() => handleRestoreEvent(record.id)} // Trigger restore with event ID
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<ReloadOutlined />}
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                                aria-label={`Restore event ${record.event_name}`}
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
            sorter: (a, b) => a.id - b.id, // Enable sorting
            width: 80, // Fixed width for ID
        },
        {
            title: <span style={{ color: '#1890ff' }}>Event Name</span>, // Blue title
            dataIndex: 'event_name',
            key: 'event_name',
            sorter: (a, b) => a.event_name.localeCompare(b.event_name), // Enable sorting
            render: (text) => <Text>{text}</Text>, // You can format text here if needed
            width: 200, // Adjust width as necessary
        },
        {
            title: <span style={{ color: '#1890ff' }}>Date Start</span>, // Blue title
            dataIndex: 'date_start',
            key: 'date_start',
            sorter: (a, b) => new Date(a.date_start) - new Date(b.date_start), // Enable sorting
            render: (text) => (
                <Text>{text ? moment(text, 'YYYY-MM-DD').format('MMMM Do YYYY') : 'N/A'}</Text> // Format the date
            ),
            width: 150, // Adjust width as necessary
        },
        {
            title: <span style={{ color: '#1890ff' }}>Date End</span>, // Blue title
            dataIndex: 'date_end',
            key: 'date_end',
            sorter: (a, b) => new Date(a.date_end) - new Date(b.date_end), // Enable sorting
            render: (text) => (
                <Text>{text ? moment(text, 'YYYY-MM-DD').format('MMMM Do YYYY') : 'N/A'}</Text> // Format the date
            ),
            width: 150, // Adjust width as necessary
        },
        {
            title: <span style={{ color: '#1890ff' }}>Time Start</span>, // Blue title
            dataIndex: 'time_start',
            key: 'time_start',
            sorter: (a, b) => {
                if (!a.time_start && !b.time_start) return 0;
                if (!a.time_start) return -1;
                if (!b.time_start) return 1;
                const timeA = moment(a.time_start, 'HH:mm'); // Changed to 'HH:mm'
                const timeB = moment(b.time_start, 'HH:mm'); // Changed to 'HH:mm'
                return timeA - timeB;
            }, // Enable sorting
            render: (text) => {
                if (!text) return <Text>N/A</Text>; // Handle optional time
                const time = moment(text, 'HH:mm'); // Changed to 'HH:mm'
                if (time.isValid()) {
                    return <Text>{time.format('hh:mm A')}</Text>; // Display time in 12-hour format
                }
                return <Text>Invalid Time</Text>; // Fallback for invalid time format
            },
            width: 120, // Adjust width as necessary
        },
        {
            title: <span style={{ color: '#1890ff' }}>Time End</span>, // Blue title
            dataIndex: 'time_end',
            key: 'time_end',
            sorter: (a, b) => {
                if (!a.time_end && !b.time_end) return 0;
                if (!a.time_end) return -1;
                if (!b.time_end) return 1;
                const timeA = moment(a.time_end, 'HH:mm'); // Changed to 'HH:mm'
                const timeB = moment(b.time_end, 'HH:mm'); // Changed to 'HH:mm'
                return timeA - timeB;
            }, // Enable sorting
            render: (text) => {
                if (!text) return <Text>N/A</Text>; // Handle optional time
                const time = moment(text, 'HH:mm'); // Changed to 'HH:mm'
                if (time.isValid()) {
                    return <Text>{time.format('hh:mm A')}</Text>; // Display time in 12-hour format
                }
                return <Text>Invalid Time</Text>; // Fallback for invalid time format
            },
            width: 120, // Adjust width as necessary
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created At</span>, // Blue title
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at), // Enable sorting
            render: (text) => (
                <Text>{text ? moment(text).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</Text> // Format the date
            ),
            hidden: showArchived, // Hide if showing archived
            width: 180, // Adjust width as necessary
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated At</span>, // Blue title
            dataIndex: 'updated_at',
            key: 'updated_at',
            sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at), // Enable sorting
            render: (text) => (
                <Text>{text ? moment(text).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</Text> // Format the date
            ),
            hidden: showArchived, // Hide if showing archived
            width: 180, // Adjust width as necessary
        },
        {
            title: <span style={{ color: '#1890ff' }}>Deleted At</span>, // Blue title
            dataIndex: 'deleted_at',
            key: 'deleted_at',
            sorter: (a, b) => new Date(a.deleted_at) - new Date(b.deleted_at), // Enable sorting
            render: (text) => (
                <Text>{text ? moment(text).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</Text> // Format the date
            ),
            hidden: !showArchived, // Hide if not showing archived
            width: 180, // Adjust width as necessary
        },
    ];

    // Conditionally remove columns based on view
    const visibleColumns = columns.filter(column => {
        if (column.hidden === undefined) return true;
        return !column.hidden;
    });

    return (
        <Table
            rowSelection={rowSelection}
            columns={visibleColumns}
            dataSource={data} // Data is already filtered and managed by parent
            rowKey="id" // Ensure each row is keyed by the unique event ID
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
            scroll={{ x: 1300 }} // Adjust horizontal scroll width based on columns
            loading={{
                spinning: loading, // Controls if the table should show loading spinner
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, // Custom loading indicator (optional)
                tip: "Loading data..." // Loading message
            }}
            bordered
        />
    );
};

export default PostEventTable;
