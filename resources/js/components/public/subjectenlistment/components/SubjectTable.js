// SubjectTable.js
import React from 'react';
import { Table, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const SubjectTable = ({
  data,
  selectedRowKeys,
  onRowSelectionChange,
  onSearchChange,
  onFilterChange,
  onSortChange,
  currentPage,
  pageSize,
  onPageChange,
  totalRecords,
}) => {
  const columns = [
    {
      title: 'Subject Code',
      dataIndex: 'subjectCode',
      sorter: true,
      // Mobile responsiveness: Display on xs, sm, and md screens
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
      sorter: true,
      // Mobile responsiveness: Display on xs, sm, and md screens
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Classification',
      dataIndex: 'classification',
      // Mobile responsiveness: Hide this column on xs screens (mobile)
      responsive: ['xs', 'sm'],
    },
    {
      title: 'Units',
      dataIndex: 'units',
      sorter: true,
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined />
          <DeleteOutlined />
        </Space>
      ),
      responsive: ['xs', 'sm'], // Hide actions on mobile devices
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowSelection={{
        selectedRowKeys,
        onChange: onRowSelectionChange,
      }}
      onChange={onSortChange}
      pagination={false} // We'll manage pagination manually
      scroll={{ x: 'max-content' }} // Enable horizontal scroll if needed
      responsive
    />
  );
};

export default SubjectTable;
