import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Space, Dropdown, Menu, Typography, message, Modal } from 'antd';
import { FilterOutlined, FileTextOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import UserTable from './components/UserTable';
import UserModals from './components/UserModals';
import MainDashboard from '../dashboard/components/MainDashboard';
import axios from 'axios';


const { Text } = Typography;

const UserPage = () => {
    const [data, setData] = useState([]); // User data
    const [filteredData, setFilteredData] = useState([]); // Filtered user data
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows
    const [searchValue, setSearchValue] = useState(''); // Search query
    const [loading, setLoading] = useState(false);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [showArchived, setShowArchived] = useState(false); // Toggle between active and archived users
    const [modalData, setModalData] = useState(null);

    // State for the confirmation delete modal
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);

    // Fetch user data from the API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Check if response.data is an array and map it to include 'status' and 'role_name' fields
                if (Array.isArray(response.data)) {
                    const users = response.data.map(user => ({
                        ...user,
                        status: user.deleted_at ? 'archived' : 'active', // Soft delete status
                        role_name: user.role ? user.role.name : 'No Role', // Extract role_name from the role relation
                    }));
                    setData(users);
                    setFilteredData(users);
                } else {
                    message.error('Error: Data received is not an array.');
                }
            } catch (error) {
                message.error('Error fetching user data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Consolidated filter function
    const filterData = useCallback(() => {
        let filtered = data.filter((user) => {
            const matchesSearch =
                user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.role_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.email.toLowerCase().includes(searchValue.toLowerCase());

            const matchesStatus = showArchived ? user.status === 'archived' : user.status === 'active';

            return matchesSearch && matchesStatus;
        });

        setFilteredData(filtered);
    }, [searchValue, showArchived, data]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    // Handle search
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    // Role filtering menu
    const roleMenu = (
        <Menu>
            <Menu.Item onClick={() => handleRoleFilter('Superadmin')}>Superadmin</Menu.Item>
            <Menu.Item onClick={() => handleRoleFilter('Admin')}>Admin</Menu.Item>
            <Menu.Item onClick={() => handleRoleFilter('Teacher')}>Teacher</Menu.Item>
            <Menu.Item onClick={() => handleRoleFilter('Student')}>Student</Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={handleReset}>Reset</Menu.Item>
        </Menu>
    );

    // Handle role filter
    const handleRoleFilter = (role) => {
        const filteredByRole = data.filter(user => {
            const matchesRole = user.role_name === role;

            // Ensure fields are defined before calling .toLowerCase()
            const matchesSearch =
                (user.username && user.username.toLowerCase().includes(searchValue.toLowerCase())) ||
                (user.role_name && user.role_name.toLowerCase().includes(searchValue.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(searchValue.toLowerCase()));

            const matchesStatus = showArchived ? user.status === 'archived' : user.status === 'active';

            return matchesRole && matchesSearch && matchesStatus;
        });

        setFilteredData(filteredByRole);
    };


    // Reset filters
    const handleReset = () => {
        setFilteredData(data);
        setSearchValue(''); // Reset search filter
    };

    // Toggle between active and archived users
    const handleArchiveToggle = () => {
        setShowArchived(!showArchived);
    };

    // Handle delete (opens confirmation modal)
    const handleDelete = () => {
        setConfirmDeleteModalVisible(true);
    };

    // Handle restore user
    const handleRestore = (userId) => {
        setData((prevData) =>
            prevData.map((user) =>
                user.id === userId ? { ...user, status: 'active' } : user
            )
        );
        message.success('User restored');
    };

    // Confirm deletion (archive users)
    const confirmDeleteUser = () => {
        const newData = data.map((user) =>
            selectedRowKeys.includes(user.id) ? { ...user, status: 'archived' } : user
        );
        setData(newData);
        message.success(`${selectedRowKeys.length} user(s) moved to archives`);
        setConfirmDeleteModalVisible(false);
        setSelectedRowKeys([]); // Reset selected rows
    };

    // Handle restore selected users
    const handleRestoreSelected = () => {
        const newData = data.map((user) =>
            selectedRowKeys.includes(user.id) ? { ...user, status: 'active' } : user
        );
        setData(newData);
        message.success(`${selectedRowKeys.length} user(s) restored`);
        setSelectedRowKeys([]); // Reset selected rows
    };

    // Row selection logic for the table
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
        getCheckboxProps: (record) => ({
            disabled: false, // Allow selection of archived users as well
        }),
    };

    // Trigger data filtering on search or showArchived toggle change
    useEffect(() => {
        filterData();
    }, [searchValue, showArchived, data, filterData]);

    return (
        <MainDashboard>
            <div className="user-page">
                <Space direction="vertical" style={{ width: '100%' }}>
                    {/* Top Controls: Search, Filter, Add User, Show Archived */}
                    <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                            <Input.Search
                                value={searchValue}
                                placeholder="Search by username or role"
                                style={{ width: 300 }}
                                onSearch={handleSearch}
                                onChange={handleSearchChange}
                                allowClear
                            />
                            <Dropdown overlay={roleMenu} trigger={['click']}>
                                <Button icon={<FilterOutlined />}>Filter by Role</Button>
                            </Dropdown>
                            <Button
                                icon={<FileTextOutlined />}
                                onClick={handleArchiveToggle}
                            >
                                {showArchived ? 'View Active Users' : 'View Archived Users'}
                            </Button>
                            <Button icon={<PrinterOutlined />}>Print</Button>
                        </Space>

                        <Space>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsCreateModalVisible(true)}
                            >
                                Create New
                            </Button>
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                onClick={handleDelete}
                            >
                                Remove
                            </Button>
                            {showArchived && (
                                <Button
                                    type="default"
                                    onClick={handleRestoreSelected}
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    Restore Selected
                                </Button>
                            )}
                        </Space>
                    </Space>

                    {/* Selected Row Count */}
                    {selectedRowKeys.length > 0 && (
                        <Text strong style={{ marginBottom: '1px', display: 'block' }}>
                            {selectedRowKeys.length} item(s) selected
                        </Text>
                    )}

                    {/* User Table */}
                    <UserTable
                        rowSelection={rowSelection}
                        data={filteredData}
                        loading={loading}
                        setIsEditModalVisible={setIsEditModalVisible}
                        setIsDeleteModalVisible={setIsDeleteModalVisible}
                        setModalData={setModalData}
                        handleDelete={handleDelete}
                        handleRestore={handleRestore}
                    />
                </Space>

                {/* User Modals (Create, Edit, Delete) */}
                <UserModals
                    isEditModalVisible={isEditModalVisible}
                    setIsEditModalVisible={setIsEditModalVisible}
                    isDeleteModalVisible={isDeleteModalVisible}
                    setIsDeleteModalVisible={setIsDeleteModalVisible}
                    isCreateModalVisible={isCreateModalVisible}
                    setIsCreateModalVisible={setIsCreateModalVisible}
                    data={data}
                    setData={setData}
                    modalData={modalData}
                    setModalData={setModalData}
                />

                {/* Confirmation Modal for Deleting */}
                <Modal
                    title="Confirm Archive"
                    visible={confirmDeleteModalVisible}
                    onOk={confirmDeleteUser}
                    onCancel={() => setConfirmDeleteModalVisible(false)}
                    okText="Yes"
                    cancelText="No"
                >
                    <p>Are you sure you want to move the selected users to the archived state?</p>
                </Modal>
            </div>
        </MainDashboard>
    );
};

export default UserPage;
