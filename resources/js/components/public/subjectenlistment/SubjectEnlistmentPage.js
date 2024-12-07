import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Row, Col, Input, Select, Button, Space, DatePicker, Table, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios'; // Import Axios
import MainDashboard from '../dashboard/components/MainDashboard'; // Import MainDashboard
import SubjectTable from './components/SubjectTable'; // Import the SubjectTable component

const { Content } = Layout;
const { Option } = Select;

const SubjectEnlistmentPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0); // Total records for pagination
  const pageSize = 5;

  const [data, setData] = useState([]);

  // Axios request to fetch subject data from the API
  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/api/subjects', {
        params: {
          page: currentPage,
          pageSize,
          search: searchText,
          filter: filterType,
          sort: sortOrder,
        },
      });
      setData(response.data.subjects); // Assuming API returns data in 'subjects' key
      setTotalRecords(response.data.total); // Assuming total number of records is returned
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchText, filterType, sortOrder]); // Fetch when these values change

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const onSortChange = (columnKey) => {
    // Handle sorting logic, set the sortOrder based on the column
    const newSortOrder = sortOrder === 'ascend' ? 'descend' : 'ascend';
    setSortOrder(newSortOrder);
  };

  return (
    <MainDashboard>
      <Content style={{ padding: '20px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              placeholder="Search subjects"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={onSearchChange}
            />
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => console.log('Create Subject')}
            >
              Add Subject
            </Button>
          </Col>
        </Row>

        <SubjectTable
          data={data}
          selectedRowKeys={selectedRowKeys}
          onRowSelectionChange={setSelectedRowKeys}
          onSearchChange={onSearchChange}
          onFilterChange={setFilterType}
          onSortChange={onSortChange}
          currentPage={currentPage}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
        />
        
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalRecords}
          onChange={onPageChange}
          showSizeChanger={false}
          style={{ marginTop: '20px' }}
        />
      </Content>
    </MainDashboard>
  );
};

export default SubjectEnlistmentPage;
