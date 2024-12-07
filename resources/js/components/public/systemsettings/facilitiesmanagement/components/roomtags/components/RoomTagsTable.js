import React from 'react';
import { Table, Space, Button, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const RoomTagsTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteRoomTag,
    handleRestoreRoomTag, // Accept the restore prop
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
                    {/* Edit Button */}
                    {!record.isArchived && (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    )}

                    {/* Delete Button */}
                    {!record.isArchived && (
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteRoomTag(record.id)}
                        />
                    )}

                    {/* Restore Button */}
                    {record.isArchived && (
                        <Button
                            type="default"
                            icon={<ReloadOutlined />}
                            onClick={() => handleRestoreRoomTag(record.id)} // use restore function
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
            title: <span style={{ color: '#1890ff' }}>Room Tag</span>,
            dataIndex: 'room_tag',
            key: 'room_tag',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Room Tag Type</span>,
            dataIndex: 'room_tag_type',
            key: 'room_tag_type',
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

export default RoomTagsTable;
