import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ClassScheduleTable from './components/ClassScheduleTable'; // Replace with your class schedule table component
import ClassScheduleModal from './components/ClassScheduleModal'; // Replace with your class schedule modal component
import { ClassScheduleData } from './components/ClassScheduleData'; // Replace with your initial class schedule data

const { Text } = Typography;

const ClassSchedulePage = () => {
    const [data, setData] = useState(ClassScheduleData || []); // Ensure data is an array
    const [archivedData, setArchivedData] = useState([]); // Ensure archivedData is an array
    const [filteredData, setFilteredData] = useState(ClassScheduleData || []); // Ensure filteredData is an array
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(schedule =>
            schedule.name && schedule.name.toLowerCase().includes(searchValue.toLowerCase()) // Added check for schedule.name
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteClassSchedule = (id) => {
        const scheduleToDelete = data.find(schedule => schedule.id === id);
        if (scheduleToDelete) {
            setData(data.filter(schedule => schedule.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...scheduleToDelete, isArchived: true }]); // Add to archived data
            message.success('Class schedule archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedSchedules = data.filter(schedule => selectedRowKeys.includes(schedule.id));
        const remainingSchedules = data.filter(schedule => !selectedRowKeys.includes(schedule.id));

        setData(remainingSchedules); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedSchedules.map(schedule => ({ ...schedule, isArchived: true }))]); // Archive selected
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedSchedules.length} schedule(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedSchedules = archivedData.filter(schedule => selectedRowKeys.includes(schedule.id));
        const remainingArchivedSchedules = archivedData.filter(schedule => !selectedRowKeys.includes(schedule.id));

        setArchivedData(remainingArchivedSchedules); // Remove selected from archived data
        setData([...data, ...selectedSchedules.map(schedule => ({ ...schedule, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedSchedules.length} schedule(s) restored successfully`);
    };

    const handleCreateClassSchedule = () => {
        setIsCreateModalVisible(true); // Show the Create Class Schedule Modal
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
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by class name"
                        style={{ minWidth: '200px', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />}>Print</Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Schedules' : 'Show Archived Schedules'}
                    </Button>
                </Space>

                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateClassSchedule}
                    >
                        Create New Schedule
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0}
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Schedules
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0}
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Schedules
                        </Button>
                    )}
                </Space>
            </div>
            <ClassScheduleTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteClassSchedule={handleDeleteClassSchedule}
            />
            <ClassScheduleModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={data}
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
            />
        </div>
    );
};

export default ClassSchedulePage;
