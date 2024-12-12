import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import SemesterAcademicYearTable from './components/SemesterAcademicYearTable'; // Replace with your semester academic year table component
import SemesterAcademicYearModal from './components/SemesterAcademicYearModal'; // Replace with your semester academic year modal component
import { semesterAcademicYearData } from './components/SemesterAcademicYearData'; // Replace with your initial semester academic year data

const { Text } = Typography;

const SemesterAcademicYearPage = () => {
    const [data, setData] = useState(semesterAcademicYearData || []); // Ensure data is an array
    const [archivedData, setArchivedData] = useState([]); // Ensure archivedData is an array
    const [filteredData, setFilteredData] = useState(semesterAcademicYearData || []); // Ensure filteredData is an array
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(semester =>
            semester.academic_year.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteSemesterAcademicYear = (id) => {
        const semesterToDelete = data.find(semester => semester.id === id);
        if (semesterToDelete) {
            setData(data.filter(semester => semester.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...semesterToDelete, isArchived: true }]); // Add to archived data
            message.success('Semester Academic Year archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedSemesters = data.filter(semester => selectedRowKeys.includes(semester.id));
        const remainingSemesters = data.filter(semester => !selectedRowKeys.includes(semester.id));

        setData(remainingSemesters); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedSemesters.map(semester => ({ ...semester, isArchived: true }))]); // Archive selected
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedSemesters.length} semester(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedSemesters = archivedData.filter(semester => selectedRowKeys.includes(semester.id));
        const remainingArchivedSemesters = archivedData.filter(semester => !selectedRowKeys.includes(semester.id));

        setArchivedData(remainingArchivedSemesters); // Remove selected from archived data
        setData([...data, ...selectedSemesters.map(semester => ({ ...semester, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedSemesters.length} semester(s) restored successfully`);
    };

    // Define the function for opening the Create Modal
    const handleCreateSemesterAcademicYear = () => {
        setIsCreateModalVisible(true); // Show the Create Semester Academic Year Modal
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
                        placeholder="Search by academic year"
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
                        {showArchived ? 'Show Active Academic Years' : 'Show Archived Academic Years'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateSemesterAcademicYear}
                    >
                        Create New Academic Year
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Academic Years
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Academic Years
                        </Button>
                    )}
                </Space>
            </div>
            <SemesterAcademicYearTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteSemesterAcademicYear={handleDeleteSemesterAcademicYear}
            />
            <SemesterAcademicYearModal
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

export default SemesterAcademicYearPage;
