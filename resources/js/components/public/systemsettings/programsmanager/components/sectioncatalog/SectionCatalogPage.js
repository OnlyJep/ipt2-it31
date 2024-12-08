// SectionCatalogPage.js
import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message,Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';
import SectionCatalogTable from './components/SectionCatalogTable';
import SectionCatalogModal from './components/SectionCatalogModal';

const { Text } = Typography;

const SectionCatalogPage = () => {
    // State Variables
    const [data, setData] = useState([]); // Active sections
    const [archivedData, setArchivedData] = useState([]); // Archived sections
    const [filteredData, setFilteredData] = useState([]); // Data after filtering/search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows for bulk actions
    const [searchValue, setSearchValue] = useState(''); // Search input value
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Visibility for Create Modal
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Visibility for Edit Modal
    const [modalData, setModalData] = useState(null); // Data to prefill in Edit Modal
    const [showArchived, setShowArchived] = useState(false); // Toggle between active and archived view
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const pageSize = 10; // Number of items per page

    const token = localStorage.getItem('auth_token'); // Authorization token

    // Fetch Active Sections
    const fetchSections = async () => {
        setLoading(true);
        setError(null); // Reset error before fetching
        try {
            const response = await axios.get('/api/sections', { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const sections = response.data;
            const activeSections = sections.filter(section => !section.isArchived);
            const archivedSections = sections.filter(section => section.isArchived);

            setData(activeSections);
            setArchivedData(archivedSections);

            // Set filtered data based on current view
            setFilteredData(showArchived ? archivedSections : activeSections);
            setCurrentPage(1); // Reset to first page on data fetch
        } catch (err) {
            console.error('Error fetching sections:', err);
            setError('Failed to fetch section data.');
            message.error('Failed to fetch section data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch Archived Sections Only
    const fetchArchivedSections = async () => {
        setLoading(true);
        setError(null); // Reset error before fetching
        try {
            const response = await axios.get('/api/sections?deleted=only', { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const archivedSections = response.data.map(section => ({
                ...section,
                isArchived: true,
            }));

            setArchivedData(archivedSections);

            if (showArchived) {
                setFilteredData(archivedSections);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error fetching archived sections:', err);
            setError('No archived content available at the moment.');
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    // Initial Data Fetch
    useEffect(() => {
        fetchSections();
    }, []);

    // Re-filter Data on Dependencies Change
    useEffect(() => {
        const baseData = showArchived ? archivedData : data;
        const filtered = baseData.filter(section =>
            String(section.section_name || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on filter
    }, [searchValue, data, archivedData, showArchived]);

    // Re-fetch Data When Toggling Archived View
    useEffect(() => {
        if (showArchived) {
            fetchArchivedSections();
        } else {
            fetchSections();
        }
    }, [showArchived]);

    // Handlers

    // Search Handler
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    // Delete (Archive) a Single Section
    const handleDeleteSection = async (id) => {
        setError(null); // Reset error before attempting deletion
        try {
            await axios.delete(`/api/sections/${id}`, { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const sectionToDelete = data.find(section => section.id === id);
            if (sectionToDelete) {
                setData(data.filter(section => section.id !== id));
                setArchivedData([...archivedData, { ...sectionToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
                message.success('Section archived successfully');
            }
        } catch (error) {
            console.error('Error archiving section:', error);
            setError('Failed to archive section.');
            message.error('Failed to archive section.');
        }
    };

    // Bulk Delete (Archive) Selected Sections
    const handleDeleteSelected = async () => {
        const selectedSections = data.filter(section => selectedRowKeys.includes(section.id));
        if (selectedSections.length === 0) return;

        setError(null); // Reset error before attempting bulk deletion
        try {
            await Promise.all(
                selectedSections.map(section =>
                    axios.delete(`/api/sections/${section.id}`, { // Adjust endpoint as per your API
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedSections.map(section => ({ ...section, isArchived: true, deleted_at: now }));
            const remainingSections = data.filter(section => !selectedRowKeys.includes(section.id));

            setData(remainingSections);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedSections.length} section(s) archived successfully`);
        } catch (error) {
            console.error('Error archiving selected sections:', error);
            setError('Failed to archive selected sections.');
            message.error('Failed to archive selected sections.');
        }
    };

    // Restore a Single Archived Section
    const handleRestoreSection = async (id) => {
        setError(null); // Reset error before attempting restoration
        try {
            await axios.post(`/api/sections/${id}/restore`, {}, { // Adjust endpoint as per your API
                headers: { Authorization: `Bearer ${token}` },
            });

            const sectionToRestore = archivedData.find(section => section.id === id);
            if (sectionToRestore) {
                const updatedArchived = archivedData.filter(section => section.id !== id);
                const restoredSection = { ...sectionToRestore, isArchived: false };
                delete restoredSection.deleted_at;
                setArchivedData(updatedArchived);
                setData([...data, restoredSection]);
                message.success('Section restored successfully');
            }
        } catch (error) {
            console.error('Error restoring section:', error);
            setError('Failed to restore section.');
            message.error('Failed to restore section.');
        }
    };

    // Bulk Restore Selected Archived Sections
    const handleRestoreSelected = async () => {
        const selectedSections = archivedData.filter(section => selectedRowKeys.includes(section.id));
        if (selectedSections.length === 0) return;

        setError(null); // Reset error before attempting restoration
        try {
            await Promise.all(
                selectedSections.map(section =>
                    axios.post(`/api/sections/${section.id}/restore`, {}, { // Adjust endpoint as per your API
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedSections = archivedData.filter(section => !selectedRowKeys.includes(section.id));
            const restoredSections = selectedSections.map(section => {
                const { deleted_at, ...rest } = section;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedSections);
            setData([...data, ...restoredSections]);
            setSelectedRowKeys([]);
            message.success(`${selectedSections.length} section(s) restored successfully`);
        } catch (error) {
            console.error('Error restoring sections:', error);
            setError('Failed to restore sections.');
            message.error('Failed to restore sections.');
        }
    };

    // Handle Create Section
    const handleCreateSection = async (sectionData) => {
        setError(null); // Reset error before attempting creation
        try {
            const response = await axios.post('/api/sections', sectionData, { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newSection = response.data; // Assuming the API returns the created section

            message.success('New section created successfully');
            setIsCreateModalVisible(false);

            // Refresh the data by fetching active sections
            fetchSections();
        } catch (error) {
            console.error('Error creating section:', error);
            setError('Failed to create section.');
            message.error('Failed to create section.');
        }
    };

    // Handle Edit Section
    const handleEditSection = async (id, updatedData) => {
        setError(null); // Reset error before attempting update
        try {
            await axios.put(`/api/sections/${id}`, updatedData, { // Adjust endpoint as per your API
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update the section in the active data
            const updatedSections = data.map(section => 
                section.id === id ? { ...section, ...updatedData, updated_at: new Date().toISOString() } : section
            );
            setData(updatedSections);
            setIsEditModalVisible(false);
            message.success('Section updated successfully');
        } catch (error) {
            console.error('Error updating section:', error);
            setError('Failed to update section.');
            message.error('Failed to update section.');
        }
    };

    // Handle Print Functionality
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
        printWindow.document.write('<html><head><title>Section Catalog</title></head><body>');
        printWindow.document.write('<h2>Section Catalog Data</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%;">');
        printWindow.document.write('<thead><tr><th>ID</th><th>Section Name</th>');
        if (!showArchived) {
            printWindow.document.write('<th>Created At</th><th>Updated At</th>');
        } else {
            printWindow.document.write('<th>Deleted At</th>');
        }
        printWindow.document.write('</tr></thead><tbody>');

        filteredData.forEach(section => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${section.id ?? ''}</td>`);
            printWindow.document.write(`<td>${section.section_name ?? ''}</td>`);
            if (!showArchived) {
                printWindow.document.write(`<td>${section.created_at ? new Date(section.created_at).toLocaleString() : ''}</td>`);
                printWindow.document.write(`<td>${section.updated_at ? new Date(section.updated_at).toLocaleString() : ''}</td>`);
            } else {
                printWindow.document.write(`<td>${section.deleted_at ? new Date(section.deleted_at).toLocaleString() : ''}</td>`);
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
    const rowSelection = {
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
                        placeholder="Search by section name"
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
                        {showArchived ? 'Show Active Sections' : 'Show Archived Sections'}
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
                                Create New Section
                            </Button>
                            <Popconfirm
                        title="Are you sure you want to delete the selected sections?"
                        onConfirm={handleDeleteSelected}
                        okText="Yes"
                        cancelText="No"
                    >
                            <Button
                                danger
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Remove Selected Sections
                            </Button>
                            </Popconfirm>
                        </>
                    )}
                    {showArchived && (
                        <Popconfirm
                        title="Are you sure you want to restore the selected sections?"
                        onConfirm={handleRestoreSelected}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            disabled={selectedRowKeys.length === 0}
                            style={{ width: '100%' }}
                        >
                            Restore Selected Sections
                        </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            {/* Section Catalog Table */}
            <SectionCatalogTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteSection={handleDeleteSection}
                handleRestoreSection={handleRestoreSection} // Pass restore function
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                showArchived={showArchived}
                loading={loading}
            />
            {/* Section Catalog Modal */}
            <SectionCatalogModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateSection={handleCreateSection}
                handleEditSection={handleEditSection}
            />
            {/* Error Message Display */}
            {error && <Text type="danger">{error}</Text>}
        </div>
    )};

    export default SectionCatalogPage;
