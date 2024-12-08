// PostAnnouncementPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';   
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';
import AnnouncementTable from './components/PostAnnouncementTable'; 
import AnnouncementModal from './components/PostAnnouncementModal'; 

const { Text } = Typography;

const PostAnnouncementPage = () => {
    const [data, setData] = useState([]); // Active announcements
    const [archivedData, setArchivedData] = useState([]); // Archived announcements
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); 
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const pageSize = 10;

    const token = localStorage.getItem('auth_token'); // Assuming you use auth tokens

    // Fetch active announcements
    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/announcement', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const announcements = response.data;
            const activeAnnouncements = announcements.filter(ann => !ann.isArchived);
            const archivedAnnouncements = announcements.filter(ann => ann.isArchived);

            setData(activeAnnouncements);
            setArchivedData(archivedAnnouncements);

            if (showArchived) {
                setFilteredData(archivedAnnouncements);
            } else {
                setFilteredData(activeAnnouncements);
            }
            setCurrentPage(1);
        } catch (err) {
            console.error('Error fetching announcements:', err);
            message.error('Failed to fetch announcement data.');
        } finally {
            setLoading(false);
        }
    }, [token, showArchived]);

    // Fetch archived announcements only
    const fetchArchivedAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/announcement?deleted=only', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const archivedAnnouncements = response.data.map(ann => ({
                ...ann,
                isArchived: true,
            }));

            setArchivedData(archivedAnnouncements);
            if (showArchived) {
                setFilteredData(archivedAnnouncements);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error fetching archived announcements:', err);
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    }, [token, showArchived]);

    useEffect(() => {
        // Initially fetch active announcements
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    useEffect(() => {
        // When toggling showArchived, fetch the appropriate data
        if (showArchived) {
            fetchArchivedAnnouncements();
        } else {
            fetchAnnouncements();
        }
    }, [showArchived, fetchArchivedAnnouncements, fetchAnnouncements]);

    useEffect(() => {
        // When search, data, archivedData, or showArchived changes, re-filter
        const baseData = showArchived ? archivedData : data;
        const filtered = baseData.filter(ann =>
            String(ann.announcement || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchValue, data, archivedData, showArchived]);

    // Handle search value change
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    // Handle creating a new announcement
    const handleCreateAnnouncement = async (announcementData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/announcement', announcementData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newAnnouncement = response.data; // Assuming the API returns the created announcement

            message.success('New announcement created successfully');
            setIsCreateModalVisible(false);

            // Refresh the data by fetching active announcements
            fetchAnnouncements();
        } catch (error) {
            console.error('Error creating announcement:', error);
            message.error('Failed to create announcement.');
        } finally {
            setLoading(false);
        }
    };

    // Handle editing an announcement
    const handleEditAnnouncement = async (id, updatedData) => {
        setLoading(true);
        try {
            await axios.put(`/api/announcement/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update the announcement in the active data
            const updatedAnnouncements = data.map(ann => 
                ann.id === id ? { ...ann, ...updatedData, updated_at: new Date().toISOString() } : ann
            );
            setData(updatedAnnouncements);
            setIsEditModalVisible(false);
            message.success('Announcement updated successfully');
        } catch (error) {
            console.error('Error updating announcement:', error);
            message.error('Failed to update announcement.');
        } finally {
            setLoading(false);
        }
    };

    // Handle archiving (deleting) a single announcement
    const handleDeleteAnnouncement = async (id) => {
        const announcementToDelete = data.find(ann => ann.id === id);
        if (!announcementToDelete) return;

        setLoading(true);
        try {
            await axios.delete(`/api/announcement/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setData(data.filter(ann => ann.id !== id));
            setArchivedData([...archivedData, { ...announcementToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
            message.success('Announcement archived successfully');
        } catch (error) {
            console.error('Error archiving announcement:', error);
            message.error('Failed to archive announcement.');
        } finally {
            setLoading(false);
        }
    };

    // Handle bulk archiving (deleting) announcements
    const handleDeleteSelected = async () => {
        const selectedAnnouncements = data.filter(ann => selectedRowKeys.includes(ann.id));
        if (selectedAnnouncements.length === 0) return;

        setLoading(true);
        try {
            await Promise.all(
                selectedAnnouncements.map(ann =>
                    axios.delete(`/api/announcement/${ann.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedAnnouncements.map(ann => ({ ...ann, isArchived: true, deleted_at: now }));
            const remainingAnnouncements = data.filter(ann => !selectedRowKeys.includes(ann.id));

            setData(remainingAnnouncements);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedAnnouncements.length} announcement(s) archived successfully`);
        } catch (error) {
            console.error('Error archiving selected announcements:', error);
            message.error('Failed to archive selected announcements.');
        } finally {
            setLoading(false);
        }
    };

    // Handle restoring a single announcement
    const handleRestoreAnnouncement = async (id) => {
        setLoading(true);
        try {
            await axios.post(`/api/announcement/${id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Remove from archivedData and add back to data
            const announcementToRestore = archivedData.find(ann => ann.id === id);
            if (announcementToRestore) {
                const updatedArchived = archivedData.filter(ann => ann.id !== id);
                const restoredAnnouncement = { ...announcementToRestore, isArchived: false };
                delete restoredAnnouncement.deleted_at;
                setArchivedData(updatedArchived);
                setData([...data, restoredAnnouncement]);
                message.success('Announcement restored successfully');
            }
        } catch (error) {
            console.error('Error restoring announcement:', error);
            message.error('Failed to restore announcement.');
        } finally {
            setLoading(false);
        }
    };

    // Handle bulk restoring announcements
    const handleRestoreSelected = async () => {
        const selectedAnnouncements = archivedData.filter(ann => selectedRowKeys.includes(ann.id));
        if (selectedAnnouncements.length === 0) return;

        setLoading(true);
        try {
            await Promise.all(
                selectedAnnouncements.map(ann =>
                    axios.post(`/api/announcement/${ann.id}/restore`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedAnnouncements = archivedData.filter(ann => !selectedRowKeys.includes(ann.id));
            const restoredAnnouncements = selectedAnnouncements.map(ann => {
                const { deleted_at, ...rest } = ann;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedAnnouncements);
            setData([...data, ...restoredAnnouncements]);
            setSelectedRowKeys([]);
            message.success(`${selectedAnnouncements.length} announcement(s) restored successfully`);
        } catch (error) {
            console.error('Error restoring announcements:', error);
            message.error('Failed to restore announcements.');
        } finally {
            setLoading(false);
        }
    };

    // Handle printing the announcement table
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
        printWindow.document.write('<html><head><title>Announcement Table</title></head><body>');
        printWindow.document.write('<h2>Announcement Data</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%;">');
        printWindow.document.write('<thead><tr><th>ID</th><th>Announcement</th>');
        if (!showArchived) {
            printWindow.document.write('<th>Created At</th><th>Updated At</th>');
        } else {
            printWindow.document.write('<th>Deleted At</th>');
        }
        printWindow.document.write('</tr></thead><tbody>');

        filteredData.forEach(ann => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${ann.id ?? ''}</td>`);
            printWindow.document.write(`<td>${ann.announcement ?? ''}</td>`);
            if (!showArchived) {
                printWindow.document.write(`<td>${ann.created_at ? new Date(ann.created_at).toLocaleString() : ''}</td>`);
                printWindow.document.write(`<td>${ann.updated_at ? new Date(ann.updated_at).toLocaleString() : ''}</td>`);
            } else {
                printWindow.document.write(`<td>${ann.deleted_at ? new Date(ann.deleted_at).toLocaleString() : ''}</td>`);
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

    // Row selection configuration for the table
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
                flexWrap: 'wrap',
                gap: '10px',
            }}>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search announcements"
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
                        {showArchived ? 'Show Active Announcements' : 'Show Archived Announcements'}
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
                                Create New Announcement
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete the selected announcements?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    disabled={selectedRowKeys.length === 0}
                                    style={{ width: '100%' }}
                                >
                                    Remove Selected Announcements
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    {showArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore the selected announcements?"
                            onConfirm={handleRestoreSelected}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Restore Selected Announcements
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            <AnnouncementTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteAnnouncement={handleDeleteAnnouncement}
                handleRestoreAnnouncement={handleRestoreAnnouncement} // Pass restore function here
                currentPage={currentPage}
                pageSize={pageSize} // Pass pageSize
                setCurrentPage={setCurrentPage}
                showArchived={showArchived} // Pass showArchived
                loading={loading}
            />
            <AnnouncementModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateAnnouncement={handleCreateAnnouncement} // Pass create handler
                handleEditAnnouncement={handleEditAnnouncement}     // Pass edit handler
            />
            {error && <Text type="danger">{error}</Text>}
        </div>
    );

};

export default PostAnnouncementPage;
