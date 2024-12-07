// UserPage.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    Input,
    Space,
    Dropdown,
    Menu,
    Typography,
    message,
    Modal,
    Row,
    Col,
} from 'antd';
import {
    FilterOutlined,
    FileTextOutlined,
    PrinterOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import UserTable from './components/UserTable';
import UserModals from './components/UserModals';
import MainDashboard from '../dashboard/components/MainDashboard';
import axios from 'axios';
import { printTable } from './components/PrintTable'; // Ensure correct path
import debounce from 'lodash.debounce';
import { useMediaQuery } from 'react-responsive';


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

    const [roles, setRoles] = useState([]); // State to hold roles for dynamic role filtering

    // Media query to detect mobile devices
    const isMobile = useMediaQuery({ maxWidth: 767 });

    // Fetch roles from the API (Optional: If roles are dynamic)
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/roles', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRoles(response.data);
            } catch (error) {
                message.error('Failed to fetch roles');
            }
        };
        fetchRoles();
    }, []);

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

                console.log('API Response:', response.data); // Log the API response

                if (Array.isArray(response.data)) {
                    const users = response.data.map(user => ({
                        ...user,
                        status: user.deleted_at ? 'archived' : 'active',
                        role_name: user.role && user.role.name ? user.role.name : 'No Role',
                    }));

                    setData(users);
                    setFilteredData(users);
                } else {
                    message.error('Error: Data received is not an array.');
                }
            } catch (error) {
                message.error('Error fetching user data: ' + (error.response?.data?.message || error.message));
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
                (user.username && user.username.toLowerCase().includes(searchValue.toLowerCase())) ||
                (user.role_name && user.role_name.toLowerCase().includes(searchValue.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(searchValue.toLowerCase()));

            const matchesStatus = showArchived ? user.status === 'archived' : user.status === 'active';

            return matchesSearch && matchesStatus;
        });

        setFilteredData(filtered); // Update the filtered data based on the search
    }, [searchValue, showArchived, data]);

    // Debounced filter function to improve performance on rapid input
    const debouncedFilter = useCallback(
        debounce(() => {
            filterData();
        }, 300),
        [filterData]
    );

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value); // Set the search value on every input change
        debouncedFilter();
    };

    const handleSearch = () => {
        filterData(); // Trigger filtering when search button is clicked or Enter is pressed
    };

    // Role filtering menu
    const roleMenu = (
        <Menu>
            {roles.length > 0 ? (
                roles.map(role => (
                    <Menu.Item key={role.id} onClick={() => handleRoleFilter(role.name)}>
                        {role.name}
                    </Menu.Item>
                ))
            ) : (
                <>
                    <Menu.Item onClick={() => handleRoleFilter('Superadmin')}>Superadmin</Menu.Item>
                    <Menu.Item onClick={() => handleRoleFilter('Admin')}>Admin</Menu.Item>
                    <Menu.Item onClick={() => handleRoleFilter('Teacher')}>Teacher</Menu.Item>
                    <Menu.Item onClick={() => handleRoleFilter('Student')}>Student</Menu.Item>
                </>
            )}
            <Menu.Divider />
            <Menu.Item onClick={handleReset}>Reset</Menu.Item>
        </Menu>
    );

    // Handle role filter
    const handleRoleFilter = (role) => {
        const filteredByRole = data.filter(user => {
            const matchesRole = user.role_name === role;

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

    // Handle restore user (with API integration)
    const handleRestore = async (userId) => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.patch(`/api/users/${userId}/restore`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData((prevData) =>
                prevData.map((user) =>
                    user.id === userId ? { ...user, status: 'active' } : user
                )
            );
            message.success('User restored');
        } catch (error) {
            message.error('Failed to restore user: ' + (error.response?.data?.message || error.message));
        }
    };

    // Confirm deletion (archive users with API integration)
    const confirmDeleteUser = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.patch('/api/users/archive', { ids: selectedRowKeys }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newData = data.map((user) =>
                selectedRowKeys.includes(user.id) ? { ...user, status: 'archived' } : user
            );
            setData(newData);
            message.success(`${selectedRowKeys.length} user(s) moved to archives`);
        } catch (error) {
            message.error('Failed to archive users: ' + (error.response?.data?.message || error.message));
        } finally {
            setConfirmDeleteModalVisible(false);
            setSelectedRowKeys([]); // Reset selected rows
        }
    };

    // Handle restore selected users with API integration
    const handleRestoreSelected = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.patch('/api/users/restore', { ids: selectedRowKeys }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newData = data.map((user) =>
                selectedRowKeys.includes(user.id) ? { ...user, status: 'active' } : user
            );
            setData(newData);
            message.success(`${selectedRowKeys.length} user(s) restored`);
        } catch (error) {
            message.error('Failed to restore users: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]); // Reset selected rows
        }
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

    // Print handler
    const handlePrint = () => {
        console.log('Data to print (filteredData):', filteredData);
        console.log('Complete Data (data):', data);
        printTable(filteredData); // Try with filteredData first
        // If issue persists, try with data
        // printTable(data);
    };

    return (
        <MainDashboard>
            <div className="user-page" style={{ padding: '16px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {/* Top Controls */}
                    <Row
                        gutter={[16, 16]}
                        justify="space-between"
                        align="middle"
                        style={{ marginBottom: 16 }}
                    >
                        <Col xs={24} sm={24} md={12}>
                            <Space wrap>
                                <Input.Search
                                    value={searchValue}
                                    placeholder="Search by username, role, or email"
                                    style={{ width: '100%', maxWidth: 300 }}
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
                                <Button
                                    icon={<PrinterOutlined />}
                                    onClick={handlePrint} // Call print function
                                >
                                    Print
                                </Button>
                            </Space>
                        </Col>
                        <Col xs={24} sm={24} md={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                            <Space wrap>
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
                        </Col>
                    </Row>

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
