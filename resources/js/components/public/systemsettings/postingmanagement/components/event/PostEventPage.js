// PostEventPage.js
import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, UnorderedListOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import PostEventTable from './components/PostEventTable'; // Import the PostEventTable component
import PostEventModal from './components/PostEventModal'; // Import the PostEventModal component
import moment from 'moment'; // Ensure moment is installed: npm install moment

const { Text } = Typography;

const PostEventPage = () => {
    // State Management
    const [data, setData] = useState([]); // Active events
    const [archivedData, setArchivedData] = useState([]); // Archived events
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search and view
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows for batch actions
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

    // Fetch Active Events
    const fetchEvents = async () => {
        setLoading(true);
        setError(null); // Reset error before fetching
        try {
            const response = await axios.get('/api/event', { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const events = response.data;
            const activeEvents = events.filter(event => !event.isArchived);
            const archivedEvents = events.filter(event => event.isArchived);

            setData(activeEvents);
            setArchivedData(archivedEvents);

            // Set filtered data based on current view
            setFilteredData(showArchived ? archivedEvents : activeEvents);
            setCurrentPage(1); // Reset to first page on data fetch
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to fetch event data.');
            message.error('Failed to fetch event data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch Archived Events Only
    const fetchArchivedEvents = async () => {
        setLoading(true);
        setError(null); // Reset error before fetching
        try {
            const response = await axios.get('/api/event?deleted=only', { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const archivedEvents = response.data.map(event => ({
                ...event,
                isArchived: true,
            }));

            setArchivedData(archivedEvents);

            if (showArchived) {
                setFilteredData(archivedEvents);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error fetching archived events:', err);
            setError('No archived content available at the moment.');
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    // Initial Data Fetch
    useEffect(() => {
        fetchEvents();
    }, []);

    // Re-filter Data on Dependencies Change
    useEffect(() => {
        const baseData = showArchived ? archivedData : data;
        const filtered = baseData.filter(event =>
            String(event.event_name || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on filter
    }, [searchValue, data, archivedData, showArchived]);

    // Re-fetch Data When Toggling Archived View
    useEffect(() => {
        if (showArchived) {
            fetchArchivedEvents();
        } else {
            fetchEvents();
        }
    }, [showArchived]);

    // Handlers

    // Search Handler
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    // Delete (Archive) a Single Event
    const handleDeleteEvent = async (id) => {
        const eventToDelete = data.find(event => event.id === id);
        if (!eventToDelete) return;

        try {
            await axios.delete(`/api/event/${id}`, { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData(data.filter(event => event.id !== id));
            setArchivedData([...archivedData, { ...eventToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
            message.success('Event archived successfully');
        } catch (error) {
            console.error('Error archiving event:', error);
            message.error('Failed to archive event.');
        }
    };

    // Bulk Delete (Archive) Selected Events
    const handleDeleteSelected = async () => {
        const selectedEvents = data.filter(event => selectedRowKeys.includes(event.id));
        if (selectedEvents.length === 0) return;

        try {
            await Promise.all(
                selectedEvents.map(event =>
                    axios.delete(`/api/event/${event.id}`, { // Adjust endpoint as per your API
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedEvents.map(event => ({ 
                ...event, 
                isArchived: true, 
                deleted_at: now,
                date_start: event.date_start,
                date_end: event.date_end,
                time_start: event.time_start,
                time_end: event.time_end,
            }));
            const remainingEvents = data.filter(event => !selectedRowKeys.includes(event.id));

            setData(remainingEvents);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedEvents.length} event(s) archived successfully`);
        } catch (error) {
            console.error('Error archiving selected events:', error);
            message.error('Failed to archive selected events.');
        }
    };

    // Restore a Single Archived Event
    const handleRestoreEvent = async (id) => {
        try {
            await axios.post(`/api/event/${id}/restore`, {}, { // Adjust endpoint as per your API
                headers: { Authorization: `Bearer ${token}` },
            });

            // Remove from archivedData and add back to data
            const eventToRestore = archivedData.find(event => event.id === id);
            if (eventToRestore) {
                const updatedArchived = archivedData.filter(event => event.id !== id);
                const restoredEvent = { 
                    ...eventToRestore, 
                    isArchived: false,
                    deleted_at: undefined, // Remove deleted_at field
                };
                setArchivedData(updatedArchived);
                setData([...data, restoredEvent]);
                message.success('Event restored successfully');
            }
        } catch (error) {
            console.error('Error restoring event:', error);
            message.error('Failed to restore event.');
        }
    };

    // Bulk Restore Selected Archived Events
    const handleRestoreSelected = async () => {
        const selectedEvents = archivedData.filter(event => selectedRowKeys.includes(event.id));
        if (selectedEvents.length === 0) return;

        try {
            await Promise.all(
                selectedEvents.map(event =>
                    axios.post(`/api/event/${event.id}/restore`, {}, { // Adjust endpoint as per your API
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedEvents = archivedData.filter(event => !selectedRowKeys.includes(event.id));
            const restoredEvents = selectedEvents.map(event => {
                const { deleted_at, ...rest } = event;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedEvents);
            setData([...data, ...restoredEvents]);
            setSelectedRowKeys([]);
            message.success(`${selectedEvents.length} event(s) restored successfully`);
        } catch (error) {
            console.error('Error restoring events:', error);
            message.error('Failed to restore events.');
        }
    };

    // Handle Create Event
    const handleCreateEvent = async (eventData) => {
        // Client-side duplicate check
        const duplicate = data.some(event => event.event_name.toLowerCase() === eventData.event_name.toLowerCase()) ||
                          archivedData.some(event => event.event_name.toLowerCase() === eventData.event_name.toLowerCase());

        if (duplicate) {
            message.error('This Event already exists.');
            return;
        }

        try {
            const response = await axios.post('/api/event', eventData, { // Adjust endpoint as per your API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newEvent = response.data; // Assuming the API returns the created event

            message.success('New event created successfully');
            setIsCreateModalVisible(false);

            // Refresh the data by fetching active events
            fetchEvents();
        } catch (error) {
            console.error('Error creating event:', error);
            if (error.response && error.response.status === 409) { // Assuming 409 Conflict for duplicates
                message.error('This Event already exists.');
            } else {
                message.error('Failed to create event.');
            }
        }
    };

    // Handle Edit Event
    const handleEditEvent = async (id, updatedData) => {
        // Client-side duplicate check
        const duplicate = data.some(event => 
            event.event_name.toLowerCase() === updatedData.event_name.toLowerCase() && event.id !== id
        ) ||
        archivedData.some(event => 
            event.event_name.toLowerCase() === updatedData.event_name.toLowerCase() && event.id !== id
        );

        if (duplicate) {
            message.error('This Event already exists.');
            return;
        }

        try {
            await axios.put(`/api/event/${id}`, updatedData, { // Adjust endpoint as per your API
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update the event in the active data
            const updatedEvents = data.map(event => 
                event.id === id ? { ...event, ...updatedData, updated_at: new Date().toISOString() } : event
            );
            setData(updatedEvents);
            setIsEditModalVisible(false);
            message.success('Event updated successfully');
        } catch (error) {
            console.error('Error updating event:', error);
            if (error.response && error.response.status === 409) { // Assuming 409 Conflict for duplicates
                message.error('This Event already exists.');
            } else {
                message.error('Failed to update event.');
            }
        }
    };

    // Handle Print Functionality
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=1300'); // Adjust width based on columns
        printWindow.document.write('<html><head><title>Event Table</title></head><body>');
        printWindow.document.write('<h2>Event Data</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%;">');
        printWindow.document.write('<thead><tr>');
        // Define table headers based on current view
        printWindow.document.write('<th>ID</th><th>Event Name</th><th>Date Start</th><th>Date End</th><th>Time Start</th><th>Time End</th>');
        if (!showArchived) {
            printWindow.document.write('<th>Created At</th><th>Updated At</th>');
        } else {
            printWindow.document.write('<th>Deleted At</th>');
        }
        printWindow.document.write('</tr></thead><tbody>');

        filteredData.forEach(event => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${event.id ?? ''}</td>`);
            printWindow.document.write(`<td>${event.event_name ?? ''}</td>`);
            printWindow.document.write(`<td>${event.date_start ? moment(event.date_start).format('MMMM Do YYYY') : 'N/A'}</td>`);
            printWindow.document.write(`<td>${event.date_end ? moment(event.date_end).format('MMMM Do YYYY') : 'N/A'}</td>`);
            printWindow.document.write(`<td>${event.time_start ? moment(event.time_start, 'hh:mm A').format('hh:mm A') : 'N/A'}</td>`);
            printWindow.document.write(`<td>${event.time_end ? moment(event.time_end, 'hh:mm A').format('hh:mm A') : 'N/A'}</td>`);
            if (!showArchived) {
                printWindow.document.write(`<td>${event.created_at ? moment(event.created_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
                printWindow.document.write(`<td>${event.updated_at ? moment(event.updated_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
            } else {
                printWindow.document.write(`<td>${event.deleted_at ? moment(event.deleted_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
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
                        placeholder="Search by event name"
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
                        {showArchived ? 'Show Active Events' : 'Show Archived Events'}
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
                                Create New Event
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to archive the selected events?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    disabled={selectedRowKeys.length === 0}
                                    style={{ width: '100%' }}
                                >
                                    Archive Selected Events
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    {showArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore the selected events?"
                            onConfirm={handleRestoreSelected}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Restore Selected Events
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            {/* Event Table */}
            <PostEventTable
                rowSelection={rowSelectionConfig}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteEvent={handleDeleteEvent}
                handleRestoreEvent={handleRestoreEvent} // Pass restore function
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                showArchived={showArchived}
                loading={loading}
            />
            {/* Event Modal */}
            <PostEventModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateEvent={handleCreateEvent} // Pass create handler
                handleEditEvent={handleEditEvent}     // Pass edit handler
                existingEvents={[...data, ...archivedData]} // Pass existing events for duplicate check
            />
            {/* Error Message Display */}
            {error && <Text type="danger">{error}</Text>}
        </div>
    )};

    export default PostEventPage;
