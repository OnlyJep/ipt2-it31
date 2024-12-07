// UserPage.js (new working functionality on filter by role)
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
    Popconfirm,
} from 'antd';
import {
    FilterOutlined,
    FileTextOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import UserTable from './components/UserTable';
import UserCreateModal from './components/UserCreateModal';
import UserEditModal from './components/UserEditModal';
import MainDashboard from '../dashboard/components/MainDashboard';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useMediaQuery } from 'react-responsive';

const { Text } = Typography;

const UserPage = () => {
    const [data, setData] = useState([]); // User data
    const [filteredData, setFilteredData] = useState([]); // Filtered user data
    const [roles, setRoles] = useState([]); // State for roles (Not used in roleMenu)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows
    const [searchValue, setSearchValue] = useState(''); // Search query
    const [loading, setLoading] = useState(false);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [showArchived, setShowArchived] = useState(false); // Toggle between active and archived users
    const [modalData, setModalData] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('All'); // Default to 'All' status filter


    // State for the confirmation delete modal
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);

    // State for selected role filter
    const [selectedRole, setSelectedRole] = useState('All');

    // Media query to detect mobile devices
    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => {
        filterData(); // Call the filterData function whenever searchValue, showArchived, selectedRole, or data changes
    }, [searchValue, showArchived, selectedRole, data, filterData]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/roles', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data)) {
                    setRoles(response.data);
                } else {
                    message.error('Error: Data received is not an array.');
                }
            } catch (error) {
                message.error('Error fetching roles: ' + (error.response?.data?.message || error.message));
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
                    const users = response.data.map(user => {
                        // Find the role name based on role_id
                        const role = roles.find(role => role.id === user.role_id);
                        return {
                            ...user,
                            status: user.deleted_at 
                            ? 'archived' 
                            : user.status === 'regular' 
                            ? 'regular' 
                            : user.status === 'irregular' 
                            ? 'irregular' 
                            : 'active',  // default to 'active' if status is not specified
                            role_name: role ? role.role_name : 'No Role',  // Use role_name instead of role_id
                        };
                    });

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
    }, [roles]);

    const reloadData = () => {
        // Reset filters and search values
        setSearchValue(''); // Reset search
        setSelectedRole('All'); // Reset role filter to 'All'
        setShowArchived(false); // Reset archived filter to show active buildings only
    
        const fetchData = async () => {
            setLoading(true); // Set loading state to true
    
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/building', { // Assuming this is the correct endpoint for buildings
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                console.log('API Response:', response.data); // Log the API response
    
                // Validate that the response data is an array
                if (Array.isArray(response.data)) {
                    const buildings = response.data.map(building => ({
                        ...building,
                        status: building.deleted_at
                            ? 'archived'
                            : 'active', // Use 'archived' for soft-deleted items
                        floor_name: building.floor ? building.floor.floor_level : 'No Floor', // Example of handling related data (floor)
                    }));
    
                    // Set data after validating and formatting
                    setData(buildings);
                    setFilteredData(buildings);
                } else {
                    message.error('Error: Data received is not an array.');
                }
            } catch (error) {
                message.error('Error fetching building data: ' + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false); // Set loading state back to false
            }
        };
    
        fetchData(); // Call fetchData to reload the data
    };
    

    // Consolidated filter function
    const filterData = useCallback(() => {
        let filtered = data.filter((user) => {
            const matchesSearch =
                (user.username && user.username.toLowerCase().includes(searchValue.toLowerCase())) ||
                (user.role_name && user.role_name.toLowerCase().includes(searchValue.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(searchValue.toLowerCase()));

            const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;

            const matchesRole = selectedRole === 'All' || user.role_name === selectedRole;

            return matchesSearch && matchesStatus && matchesRole;
        });

        setFilteredData(filtered); // Update the filtered data based on the search, status, and role
    }, [searchValue, showArchived, selectedRole, data]);

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

    // Original Role filtering menu with static roles
    const roleMenu = (
        <Menu>
            {roles.map(role => (
                <Menu.Item key={role.id} onClick={() => handleRoleFilter(role.role_name)}>
                    {role.role_name}
                </Menu.Item>
            ))}
            <Menu.Divider />
            <Menu.Item onClick={() => handleRoleFilter('All')}>All Roles</Menu.Item> {/* Reset filter */}
        </Menu>
    );
    
    const handleRoleFilter = (role) => {
        setSelectedRole(role); // Update the selected role filter
    };

    // Reset filters
    const handleReset = () => {
        setFilteredData(data);
        setSearchValue(''); // Reset search filter
        setSelectedRole('All'); // Reset role filter
    };

    // Toggle between active and archived users
    const handleArchiveToggle = () => {
        setShowArchived(!showArchived);  // Toggle the showArchived state
    
        // Fetch users with the appropriate 'deleted' parameter based on the showArchived state
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        deleted: showArchived ? 'false' : 'only',  // Use 'only' for archived users, 'false' for active users
                    },
                });
    
                console.log('API Response:', response.data);  // Log the API response
    
                if (Array.isArray(response.data)) {
                    const users = response.data.map(user => {
                        const role = roles.find(role => role.id === user.role_id);
                        return {
                            ...user,
                            status: user.deleted_at 
                                ? 'archived' 
                                : user.status === 'regular' 
                                ? 'regular' 
                                : user.status === 'irregular' 
                                ? 'irregular' 
                                : 'active',  // default to 'active' if status is not specified
                            role_name: role ? role.role_name : 'No Role', 
                        };
                    });
    
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
    }; 

    // Handle delete (opens confirmation modal)
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            console.log("Selected IDs for Delete:", selectedRowKeys);  // Log the selected IDs
    
            // Send a DELETE request for each selected user
            const deletePromises = selectedRowKeys.map(async (id) => {
                return axios.delete(`/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            });
    
            // Wait for all delete requests to finish
            await Promise.all(deletePromises);
    
            // If delete is successful, reload the data to reflect the changes
            reloadData(); // Fetch updated user list and refresh UI
    
            message.success(`${selectedRowKeys.length} user(s) deleted`);
        } catch (error) {
            message.error('Failed to delete users: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]);  // Reset selected rows after deletion
        }
    };

    const handleSpecificDelete = async (id) => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove the deleted user from the state
            setData(prevData => prevData.filter(user => user.id !== id));
            message.success('User deleted successfully');
        } catch (error) {
            message.error('Failed to delete user: ' + (error.response?.data?.message || error.message));
        }
    };
    

    // Handle restore user (with API integration)
    const handleRestore = async (userId) => {
        try {
            const token = localStorage.getItem('auth_token');
            // Send API request to restore the user
            await axios.post(`/api/users/${userId}/restore`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            reloadData(); 
            // Update the UI with the restored user status
            setData((prevData) =>
                prevData.map((user) =>
                    user.id === userId ? { ...user, status: 'active' } : user
                )
            );
    
            message.success('User restored'); // Success message
        } catch (error) {
            message.error('Failed to restore user: ' + (error.response?.data?.message || error.message)); // Error handling
        }
    };
    

    // Confirm deletion (archive users with API integration)
    const confirmDeleteUser = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            // Send API request to archive the selected users
            await axios.patch('/api/users/archive', { ids: selectedRowKeys }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Update the status of the users in the state
            const newData = data.map((user) =>
                selectedRowKeys.includes(user.id) ? { ...user, status: 'archived' } : user
            );
            setData(newData); // Update the state with the new status of the users
            setFilteredData(newData); // Also update filteredData to reflect the changes
    
            message.success(`${selectedRowKeys.length} user(s) moved to archives`); // Success message
        } catch (error) {
            message.error('Failed to archive users: ' + (error.response?.data?.message || error.message)); // Error handling
        } finally {
            setConfirmDeleteModalVisible(false); // Close the confirmation modal
            setSelectedRowKeys([]); // Reset selected rows
        }
    };
    
    

    // Handle restore selected users with API integration
    const handleRestoreSelected = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            console.log("Selected IDs for Restore:", selectedRowKeys);  // Log the selected IDs
    
            // Send a POST request for each selected user
            const restorePromises = selectedRowKeys.map(async (id) => {
                return axios.post(`/api/users/${id}/restore`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            });
    
            // Wait for all requests to finish
            await Promise.all(restorePromises);

            reloadData(); 
    
            // Update the data on the frontend once all users are restored
            const newData = data.map((user) =>
                selectedRowKeys.includes(user.id) ? { ...user, status: 'active' } : user
            );
            setData(newData);  // Update the state with restored users
            message.success(`${selectedRowKeys.length} user(s) restored`);
        } catch (error) {
            message.error('Failed to restore users: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]);  // Reset selected rows
        }
    };
    

    // Row selection logic for the table
    const rowSelectionConfig = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
        getCheckboxProps: (record) => ({
            disabled: false, // Allow selection of archived users as well
        }),
    };

    // Trigger data filtering on search, showArchived, selectedRole, or data change
    useEffect(() => {
        filterData();
    }, [filterData]);

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
                                    <Button icon={<FilterOutlined />}>
                                        {selectedRole === 'All' ? 'Filter by Role' : `Role: ${selectedRole}`}
                                    </Button>
                                </Dropdown>
                                <Button
                                    icon={<FileTextOutlined />}
                                    onClick={handleArchiveToggle}
                                >
                                    {showArchived ? 'View Active Users' : 'View Archived Users'}
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    disabled={searchValue === '' && selectedRole === 'All'}
                                >
                                    Reset Filters
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
                                {!showArchived && (
                                <Popconfirm
                                    title="Are you sure to delete this user/s?"
                                    onConfirm={() => handleDelete()} // Corrected this line to call the handleDelete function
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        disabled={selectedRowKeys.length === 0} // Button will be disabled if no rows are selected
                                    >
                                        Remove
                                    </Button>
                                </Popconfirm>
                                )}
                                {showArchived && (
                                <Popconfirm
                                    title="Are you sure to restore this user/s?"
                                    onConfirm={() => handleRestoreSelected()} // Corrected this line to call the handleDelete function
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        type="default"
                                        disabled={selectedRowKeys.length === 0}
                                    >
                                        Restore Selected
                                    </Button>
                                </Popconfirm>
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
                        rowSelection={rowSelectionConfig}
                        data={filteredData}
                        loading={loading}
                        setIsEditModalVisible={setIsEditModalVisible}
                        setIsDeleteModalVisible={setIsDeleteModalVisible}
                        setModalData={setModalData}
                        handleDelete={handleDelete}
                        handleRestore={handleRestore}
                        handleSpecificDelete={handleSpecificDelete}
                        reloadData={reloadData} // Pass reloadData to UserTable
                    />
                </Space>

                {/* User Modals (Create, Edit, Delete) */}
                <UserCreateModal
                    isVisible={isCreateModalVisible}
                    setIsVisible={setIsCreateModalVisible}
                    reloadData={reloadData}
                    roles={roles}
                />

                <UserEditModal
                    isVisible={isEditModalVisible}
                    setIsVisible={setIsEditModalVisible}
                    reloadData={reloadData}
                    modalData={modalData}
                    setModalData={setModalData}
                    roles={roles}
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
