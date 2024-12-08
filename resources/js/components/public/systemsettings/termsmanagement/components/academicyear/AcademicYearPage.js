// AcademicYearPage.js
import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';
import AcademicYearTable from './components/AcademicYearTable';
import AcademicYearModal from './components/AcademicYearModal';

const { Text } = Typography;

const AcademicYearPage = () => {
    const [data, setData] = useState([]); // Active academic years
    const [archivedData, setArchivedData] = useState([]); // Archived academic years
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows for bulk actions
    const [searchValue, setSearchValue] = useState(''); // Search input value
    const [loading, setLoading] = useState(false); // Loading state
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Visibility for Create Modal
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Visibility for Edit Modal
    const [modalData, setModalData] = useState(null); // Data to prefill in Edit Modal
    const [showArchived, setShowArchived] = useState(false); // Toggle between active and archived view
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const [error, setError] = useState(null); // Error state
    const pageSize = 10; // Number of items per page

    const token = localStorage.getItem('auth_token'); // Authorization token

    // Fetch Active Academic Years
    const fetchAcademicYears = async () => {
        setLoading(true);
        setError(null); // Reset error before fetching
        try {
            const response = await axios.get('/api/academicyear', { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const academicYears = response.data;
            const activeAcademicYears = academicYears.filter(year => !year.isArchived);
            const archivedAcademicYears = academicYears.filter(year => year.isArchived);

            setData(activeAcademicYears);
            setArchivedData(archivedAcademicYears);

            // Set filtered data based on current view
            setFilteredData(showArchived ? archivedAcademicYears : activeAcademicYears);
            setCurrentPage(1); // Reset to first page on data fetch
        } catch (err) {
            console.error('Error fetching academic years:', err);
            setError('Failed to fetch academic year data.');
            message.error('Failed to fetch academic year data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch Archived Academic Years Only
    const fetchArchivedAcademicYears = async () => {
        setLoading(true);
        setError(null); // Reset error before fetching
        try {
            const response = await axios.get('/api/academicyear?deleted=only', { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const archivedAcademicYears = response.data.map(year => ({
                ...year,
                isArchived: true,
            }));

            setArchivedData(archivedAcademicYears);

            if (showArchived) {
                setFilteredData(archivedAcademicYears);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error fetching archived academic years:', err);
            setError('No archived content available at the moment.');
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    // Initial Data Fetch
    useEffect(() => {
        fetchAcademicYears();
    }, []);

    // Re-filter Data on Dependencies Change
    useEffect(() => {
        const baseData = showArchived ? archivedData : data;
        const filtered = baseData.filter(year =>
            String(year.academic_year || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on filter
    }, [searchValue, data, archivedData, showArchived]);

    // Re-fetch Data When Toggling Archived View
    useEffect(() => {
        if (showArchived) {
            fetchArchivedAcademicYears();
        } else {
            fetchAcademicYears();
        }
    }, [showArchived]);

    // Handlers

    // Search Handler
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    // Delete (Archive) a Single Academic Year
    const handleDeleteAcademicYear = async (id) => {
        setError(null); // Reset error before attempting deletion
        try {
            await axios.delete(`/api/academicyear/${id}`, { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const academicYearToDelete = data.find(year => year.id === id);
            if (academicYearToDelete) {
                setData(data.filter(year => year.id !== id));
                setArchivedData([...archivedData, { ...academicYearToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
                message.success('Academic year archived successfully');
            }
        } catch (error) {
            console.error('Error archiving academic year:', error);
            setError('Failed to archive academic year.');
            message.error('Failed to archive academic year.');
        }
    };

    // Bulk Delete (Archive) Selected Academic Years
    const handleDeleteSelected = async () => {
        const selectedYears = data.filter(year => selectedRowKeys.includes(year.id));
        if (selectedYears.length === 0) return;

        setError(null); // Reset error before attempting bulk deletion
        try {
            await Promise.all(
                selectedYears.map(year =>
                    axios.delete(`/api/academicyear/${year.id}`, { // Adjust endpoint as per your API
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedYears.map(year => ({ ...year, isArchived: true, deleted_at: now }));
            const remainingYears = data.filter(year => !selectedRowKeys.includes(year.id));

            setData(remainingYears);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedYears.length} academic year(s) archived successfully`);
        } catch (error) {
            console.error('Error archiving selected academic years:', error);
            setError('Failed to archive selected academic years.');
            message.error('Failed to archive selected academic years.');
        }
    };

    // Restore a Single Archived Academic Year
    const handleRestoreAcademicYear = async (id) => {
        setError(null); // Reset error before attempting restoration
        try {
            await axios.post(`/api/academicyear/${id}/restore`, {}, { // Adjust endpoint as per your API
                headers: { Authorization: `Bearer ${token}` },
            });

            const academicYearToRestore = archivedData.find(year => year.id === id);
            if (academicYearToRestore) {
                const updatedArchived = archivedData.filter(year => year.id !== id);
                const restoredAcademicYear = { ...academicYearToRestore, isArchived: false };
                delete restoredAcademicYear.deleted_at;
                setArchivedData(updatedArchived);
                setData([...data, restoredAcademicYear]);
                message.success('Academic year restored successfully');
            }
        } catch (error) {
            console.error('Error restoring academic year:', error);
            setError('Failed to restore academic year.');
            message.error('Failed to restore academic year.');
        }
    };

    // Bulk Restore Selected Archived Academic Years
    const handleRestoreSelected = async () => {
        const selectedYears = archivedData.filter(year => selectedRowKeys.includes(year.id));
        if (selectedYears.length === 0) return;

        setError(null); // Reset error before attempting restoration
        try {
            await Promise.all(
                selectedYears.map(year =>
                    axios.post(`/api/academicyear/${year.id}/restore`, {}, { // Adjust endpoint as per your API
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedYears = archivedData.filter(year => !selectedRowKeys.includes(year.id));
            const restoredYears = selectedYears.map(year => {
                const { deleted_at, ...rest } = year;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedYears);
            setData([...data, ...restoredYears]);
            setSelectedRowKeys([]);
            message.success(`${selectedYears.length} academic year(s) restored successfully`);
        } catch (error) {
            console.error('Error restoring academic years:', error);
            setError('Failed to restore academic years.');
            message.error('Failed to restore academic years.');
        }
    };

    // Handle Create Academic Year
    const handleCreateAcademicYear = async (yearData) => {
        setError(null); // Reset error before attempting creation
        // Client-side duplicate check
        const duplicate = data.some(year => year.academic_year.toLowerCase() === yearData.academic_year.toLowerCase()) ||
                          archivedData.some(year => year.academic_year.toLowerCase() === yearData.academic_year.toLowerCase());

        if (duplicate) {
            message.error('This Academic Year already exists.');
            return;
        }

        try {
            const response = await axios.post('/api/academicyear', yearData, { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newAcademicYear = response.data; // Assuming the API returns the created academic year

            message.success('New academic year created successfully');
            setIsCreateModalVisible(false);

            // Refresh the data by fetching active academic years
            fetchAcademicYears();
        } catch (error) {
            console.error('Error creating academic year:', error);
            if (error.response && error.response.status === 409) { // Assuming 409 Conflict for duplicates
                message.error('This Academic Year already exists.');
            } else {
                setError('Failed to create academic year.');
                message.error('Failed to create academic year.');
            }
        }
    };

    // Handle Edit Academic Year
    const handleEditAcademicYear = async (id, updatedData) => {
        setError(null); // Reset error before attempting update
        // Client-side duplicate check
        const duplicate = data.some(year => 
            year.academic_year.toLowerCase() === updatedData.academic_year.toLowerCase() && year.id !== id
        ) ||
        archivedData.some(year => 
            year.academic_year.toLowerCase() === updatedData.academic_year.toLowerCase() && year.id !== id
        );

        if (duplicate) {
            message.error('This Academic Year already exists.');
            return;
        }

        try {
            await axios.put(`/api/academicyear/${id}`, updatedData, { // Adjust endpoint as per your API
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update the academic year in the active data
            const updatedAcademicYears = data.map(year => 
                year.id === id ? { ...year, ...updatedData, updated_at: new Date().toISOString() } : year
            );
            setData(updatedAcademicYears);
            setIsEditModalVisible(false);
            message.success('Academic year updated successfully');
        } catch (error) {
            console.error('Error updating academic year:', error);
            if (error.response && error.response.status === 409) { // Assuming 409 Conflict for duplicates
                message.error('This Academic Year already exists.');
            } else {
                setError('Failed to update academic year.');
                message.error('Failed to update academic year.');
            }
        }
    };

    // Handle Print Functionality
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
        printWindow.document.write('<html><head><title>Academic Year Table</title></head><body>');
        printWindow.document.write('<h2>Academic Year Data</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%;">');
        printWindow.document.write('<thead><tr><th>ID</th><th>Academic Year</th>');
        if (!showArchived) {
            printWindow.document.write('<th>Created At</th><th>Updated At</th>');
        } else {
            printWindow.document.write('<th>Deleted At</th>');
        }
        printWindow.document.write('</tr></thead><tbody>');

        filteredData.forEach(year => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${year.id ?? ''}</td>`);
            printWindow.document.write(`<td>${year.academic_year ?? ''}</td>`);
            if (!showArchived) {
                printWindow.document.write(`<td>${year.created_at ? new Date(year.created_at).toLocaleString() : ''}</td>`);
                printWindow.document.write(`<td>${year.updated_at ? new Date(year.updated_at).toLocaleString() : ''}</td>`);
            } else {
                printWindow.document.write(`<td>${year.deleted_at ? new Date(year.deleted_at).toLocaleString() : ''}</td>`);
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

    // Row Selection Configuration
    const rowSelectionConfig = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            {/* Top Controls: Search and Buttons */}
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
            }}>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by academic year"
                        style={{ width: '100%', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />} style={{ width: '100%' }} onClick={handlePrint}>
                        Print
                    </Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Academic Years' : 'Show Archived Academic Years'}
                    </Button>
                </Space>
                <Space
                    wrap
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        width: '100%',
                    }}
                >
                    {!showArchived && (
                        <>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsCreateModalVisible(true)}
                                style={{ width: '100%' }}
                            >
                                Create New Academic Year
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete the selected academic years?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    disabled={selectedRowKeys.length === 0}
                                    style={{ width: '100%' }}
                                >
                                    Remove Selected Academic Years
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    {showArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore the selected academic years?"
                            onConfirm={handleRestoreSelected}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Restore Selected Academic Years
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            {/* Academic Years Table */}
            <AcademicYearTable
                rowSelection={rowSelectionConfig}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteAcademicYear={handleDeleteAcademicYear}
                handleRestoreAcademicYear={handleRestoreAcademicYear} // Pass restore function
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                showArchived={showArchived}
                loading={loading}
            />
            {/* Academic Years Modal */}
            <AcademicYearModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateAcademicYear={handleCreateAcademicYear} // Pass create handler
                handleEditAcademicYear={handleEditAcademicYear}     // Pass edit handler
                existingAcademicYears={[...data, ...archivedData]} // Pass existing academic years for duplicate check
            />
            {/* Error Message Display */}
            {error && <Text type="danger">{error}</Text>}
        </div>
    )};

    export default AcademicYearPage;