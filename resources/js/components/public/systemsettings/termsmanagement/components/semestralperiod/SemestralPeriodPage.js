// SemestralPeriodPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import moment from 'moment'; // Import moment for date formatting
import SemestralPeriodTable from './components/SemestralPeriodTable';
import SemestralPeriodModal from './components/SemestralPeriodModal';
//import { semestralPeriodData } from './components/SemestralPeriodData'; // Replace with your initial semestral period data

const { Text } = Typography;

const SemestralPeriodPage = () => {
    const [data, setData] = useState([]); // Store active data
    const [archivedData, setArchivedData] = useState([]); // Store archived data
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view
    const [loading, setLoading] = useState(false); // For loading state

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(period =>
            period.semester_period.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    // Get the auth token (from localStorage, context, etc.)
    const authToken = localStorage.getItem('auth_token');

    const fetchSemesters = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/semester', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    deleted: showArchived ? 'true' : 'false', // Fetch archived data if showArchived is true
                },
            });

            // Split the data into active and archived based on deleted_at
            const activeData = response.data.filter(semester => !semester.deleted_at);
            const archivedData = response.data.filter(semester => semester.deleted_at);

            // Set data based on the toggle of showArchived
            setData(activeData);
            setArchivedData(archivedData);

            // Apply filter based on search query if any
            const filtered = (showArchived ? archivedData : activeData).filter(semester =>
                semester.semester_period.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredData(filtered);

        } catch (error) {
            message.error('Error fetching semesters: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemesters();
    }, [showArchived, searchValue]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleCreateSemester = async (values) => {
        try {
            const token = localStorage.getItem('auth_token');

            const response = await axios.post('/api/semester', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData((prevData) => [...prevData, response.data.semester]); // Add new semester to state
            message.success('Semester Period created successfully');
            setIsCreateModalVisible(false); // Close modal after creation
        } catch (error) {
            message.error('Failed to create Semester Period: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteSemester = async (id) => {
        const authToken = localStorage.getItem('auth_token'); // Get the auth token

        try {
            // Make the DELETE request to the backend API
            await axios.delete(`/api/semester/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Include the token in the request header
                },
            });

            // On success, remove the deleted semester from the state
            setData((prevData) => prevData.filter((semester) => semester.id !== id));
            message.success('Semester deleted successfully');
        } catch (error) {
            message.error('Failed to delete semester');
        }
    };

    const handleDeleteSelected = async () => {
        const authToken = localStorage.getItem('auth_token'); // Get the auth token

        try {
            // Create an array of promises for deleting the selected rows
            const deletePromises = selectedRowKeys.map((id) => {
                return axios.delete(`/api/semester/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Include the token in the request header
                    },
                });
            });

            // Wait for all promises to finish
            await Promise.all(deletePromises);

            // Reload data after deletion
            fetchSemesters();

            message.success(`${selectedRowKeys.length} Semester(s) deleted.`);
        } catch (error) {
            message.error('Failed to delete semesters: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]); // Reset selected rows after deletion
        }
    };

    const handleEditSemester = async (id, values) => {
        try {
            const token = localStorage.getItem('auth_token');

            const response = await axios.put(`/api/semester/${id}`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedData = data.map((semester) =>
                semester.id === id ? { ...semester, ...response.data.semester } : semester
            );
            setData(updatedData); // Update the semester in state
            message.success('Semester Period updated successfully');
            setIsEditModalVisible(false); // Close modal after update
        } catch (error) {
            message.error('Failed to update Semester Period: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRestoreSemester = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            // Send a POST request to restore the semester
            const response = await axios.post(`/api/semester/${id}/restore`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Reload the semester data after restoring the item
            fetchSemesters(); // Refresh the semester list
            message.success('Semester restored successfully.');
        } catch (error) {
            message.error('Failed to restore semester: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreSelected = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            // Create an array of promises for restoring the selected rows
            const restorePromises = selectedRowKeys.map((id) => {
                return axios.post(`/api/semester/${id}/restore`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the request header
                    },
                });
            });

            // Wait for all promises to finish
            await Promise.all(restorePromises);

            // Reload data after restoring
            fetchSemesters();

            message.success(`${selectedRowKeys.length} Semester(s) restored.`);
        } catch (error) {
            message.error('Failed to restore semesters: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]); // Reset selected rows after restoring
            setLoading(false);
        }
    };

    // Implement the handlePrint function
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=1300');
        printWindow.document.write('<html><head><title>Semester Periods</title>');
        // Include any necessary styles here
        printWindow.document.write(`
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2>Semester Periods</h2>');
        printWindow.document.write('<table>');
        printWindow.document.write('<thead><tr>');
        // Define table headers based on your data structure
        printWindow.document.write('<th>ID</th><th>Semester Period</th><th>Created At</th><th>Updated At</th>');
        if (showArchived) {
            printWindow.document.write('<th>Deleted At</th>');
        }
        printWindow.document.write('</tr></thead><tbody>');

        // Iterate over filteredData to populate the table
        filteredData.forEach(semester => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${semester.id ?? ''}</td>`);
            printWindow.document.write(`<td>${semester.semester_period ?? ''}</td>`);
            printWindow.document.write(`<td>${semester.created_at ? moment(semester.created_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
            printWindow.document.write(`<td>${semester.updated_at ? moment(semester.updated_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
            if (showArchived) {
                printWindow.document.write(`<td>${semester.deleted_at ? moment(semester.deleted_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
            }
            printWindow.document.write('</tr>');
        });

        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap', // Allow wrapping when screen size reduces
            }}>
                {/* Search and Buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by semester period"
                        style={{ minWidth: '200px', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />} onClick={handlePrint}>
                        Print
                    </Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Semesters' : 'Show Archived Semesters'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalVisible(true)} // Opens the modal to create a new semester
                    >
                        Create New Semester Period
                    </Button>
                    {!showArchived && (
                        <Button
                            danger
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        >
                            <Popconfirm
                                title="Are you sure to delete the selected semesters?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                Remove Selected Semesters
                            </Popconfirm>
                        </Button>
                    )}
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        >
                            <Popconfirm
                                title="Are you sure to restore the selected semesters?"
                                onConfirm={handleRestoreSelected} // Call restore selected rows function
                                okText="Yes"
                                cancelText="No"
                            >
                                Restore Selected Semesters
                            </Popconfirm>
                        </Button>
                    )}
                </Space>
            </div>
            <SemestralPeriodTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteSemester={handleDeleteSemester}
                handleRestoreSemester={handleRestoreSemester}
                handleDeleteSelected={handleDeleteSelected}
                handleRestoreSelected={handleRestoreSelected}
                loading={loading} // Pass loading state if your table component handles it
            />
            <SemestralPeriodModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={data}
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
                handleCreateSemester={handleCreateSemester}
                handleEditSemester={handleEditSemester}
            />
            {/* Error Message Display */}
            {/* {error && <Text type="danger">{error}</Text>} */}
        </div>
    );
};

export default SemestralPeriodPage;
