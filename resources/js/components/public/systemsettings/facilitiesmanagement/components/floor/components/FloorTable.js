import React from 'react';
import { Table, Space, Button, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const FloorTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteFloor,
    handleRestoreFloor, // Accept the restore prop
    currentPage,
    pageSize,
    setCurrentPage,
    showArchived
}) => {
    const handleEdit = (record) => {
        setModalData(record);
        setIsEditModalVisible(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const baseColumns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>,
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {!record.isArchived && (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    )}
                    {!record.isArchived && (
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteFloor(record.id)}
                        />
                    )}
                    {record.isArchived && (
                        <Button
                            type="default"
                            icon={<ReloadOutlined />}
                            onClick={() => handleRestoreFloor(record.id)} // Use restore function here
                        >
                            Restore
                        </Button>
                    )}
                </Space>
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>ID</span>,
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Floor Level</span>,
            dataIndex: 'floor_level',
            key: 'floor_level',
        },
    ];

    const extraColumns = showArchived
        ? [
            {
                title: <span style={{ color: '#1890ff' }}>Deleted At</span>,
                dataIndex: 'deleted_at',
                key: 'deleted_at',
                render: (value) => value || 'None'
            }
        ]
        : [
            {
                title: <span style={{ color: '#1890ff' }}>Created At</span>,
                dataIndex: 'created_at',
                key: 'created_at',
                render: (value) => value || 'None'
            },
            {
                title: <span style={{ color: '#1890ff' }}>Updated At</span>,
                dataIndex: 'updated_at',
                key: 'updated_at',
                render: (value) => value || 'None'
            }
        ];

    const columns = [...baseColumns, ...extraColumns];

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
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
                    <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                </div>
            )}
        />
    );
};

export default FloorTable;
