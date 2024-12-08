import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Form, message, Table, Spin } from 'antd';
import axios from 'axios'; // Make sure axios is imported

const YearLevelModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData,
    isPrintPreviewVisible,
    setIsPrintPreviewVisible, 
    closePrintPreview,
}) => {
    const [form] = Form.useForm();
    const [isPrinted, setIsPrinted] = useState(false);  // State to track if the table has been printed

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            form.setFieldsValue({
                year_level: modalData.year_level, // Editable year level
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const yearLevelMap = {
        1: 'First Year',
        2: 'Second Year',
        3: 'Third Year',
        4: 'Fourth Year',
        5: 'Fifth Year',
        6: 'Sixth Year',
        7: 'Seventh Year',
        8: 'Eighth Year',
        9: 'Ninth Year',
        10: 'Tenth Year',
    };
    
    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const yearLevelName = values.year_level.trim();
    
            // Ensure the input is a valid number between 1 and 10
            const yearLevelInt = parseInt(yearLevelName);
            if (isNaN(yearLevelInt) || yearLevelInt < 1 || yearLevelInt > 10) {
                message.error('Year level must be an integer between 1 and 10.');
                return;
            }
    
            // If editing, update the year level
            if (isEditModalVisible) {
                try {
                    const token = localStorage.getItem('auth_token');
    
                    // Send PUT request to update the existing year level
                    const response = await axios.put(
                        `/api/yearlevel/${modalData.id}`,  // Update endpoint with id
                        { year_level: yearLevelName }, // Send updated year level
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // Authorization header with token
                            },
                        }
                    );
    
                    // Update the data on the frontend after successful update
                    const updatedData = data.map((yearLevel) =>
                        yearLevel.id === modalData.id
                            ? { ...yearLevel, year_level: yearLevelName } // Update the year level
                            : yearLevel
                    );
                    setData(updatedData); // Update the state with new data
    
                    message.success('Year level updated successfully!');
                    setIsEditModalVisible(false); // Close the modal after update
                } catch (error) {
                    message.error('Failed to update year level: ' + (error.response?.data?.message || error.message));
                }
            } else {
                // If creating a new year level
                try {
                    const token = localStorage.getItem('auth_token');
    
                    // Send POST request to create a new year level
                    const response = await axios.post(
                        '/api/yearlevel', // Create endpoint
                        { year_level: yearLevelName }, // Send the new year level
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // Authorization header with token
                            },
                        }
                    );
    
                    // Update the data on the frontend after successful creation
                    setData((prevData) => [...prevData, response.data.yearLevel]);
    
                    message.success('Year level created successfully!');
                    setIsCreateModalVisible(false); // Close the modal after create
                } catch (error) {
                    message.error('Failed to create year level: ' + (error.response?.data?.message || error.message));
                }
            }
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); // Clear the form when the modal is canceled
    };

    // Function to print the table
    const handlePrint = () => {
        // Get the table content
        const content = document.getElementById('printable-table').outerHTML;
    
        // Open a new print window
        const printWindow = window.open('', '', 'height=600,width=800');
    
        // Write the full content to the print window
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Year Levels</title>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        table, th, td {
                            border: 1px solid black;
                        }
                        th, td {
                            padding: 8px;
                            text-align: left;
                        }
                    </style>
                </head>
                <body>
                    <h1>Year Levels</h1>
                    ${content}
                </body>
            </html>
        `);
    
        printWindow.document.close(); // Close the document
        printWindow.print(); // Trigger the print dialog
        setIsPrinted(true);  // Optionally hide the print button after printing
    };
    

    const modifiedData = data.map(item => ({
        ...item,
        year_level: yearLevelMap[item.year_level] || item.year_level,  // Replace number with text if available
    }));

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Year Level', dataIndex: 'year_level', key: 'year_level' },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => new Date(text).toLocaleString(),
        }
    ];
    

    return (
        <div>
            {/* Create/Edit Modal */}
            <Modal
                title={isEditModalVisible ? 'Edit Year Level' : 'Create New Year Level'}
                visible={isEditModalVisible || isCreateModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={isEditModalVisible ? 'Save Changes' : 'Create Year Level'}
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical" onFinish={handleOk}>
                    <Form.Item
                        label="Year Level"
                        name="year_level"
                        rules={[
                            { required: true, message: 'Please input the Year Level!' },
                            {
                                pattern: /^(10|[1-9])$/, // Allow integers from 1 to 10
                                message: 'Year Level must be an integer between 1 and 10',
                            },
                        ]}
                    >
                        <Input
                            type="number" // Ensure input type is number
                            min={1} // Minimum value for year level
                            max={10} // Maximum value for year level
                            onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} // Ensure key press is numeric only
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Print Preview Modal */}
            <Modal
                title="Print Year Levels"
                visible={isPrintPreviewVisible}
                onCancel={closePrintPreview}
                footer={null}
                style={{ maxWidth: '80%', margin: 'auto' }}
                bodyStyle={{ paddingBottom: '80px' }} // Add bottom padding for button space
            >
                <div style={{ position: 'relative', minHeight: '400px' }}>  {/* Set a min height for content */}
                    {/* Display loading spinner if no data */}
                    {modifiedData.length === 0 ? (
                        <Spin tip="Loading..." />
                    ) : (
                        <Table
                            id="printable-table"
                            rowKey="id"
                            columns={columns}
                            dataSource={modifiedData}  // Ensure modifiedData has all required fields
                            pagination={false}
                            bordered
                            size="small"
                        />
                    )}

                    {/* Print Button */}
                    <div style={{
                        position: 'absolute',
                        right: '20px',
                        bottom: '20px',
                        display: isPrinted ? 'none' : 'block',  // Hide the button after printing
                    }}>
                        <Button
                            type="primary"
                            onClick={handlePrint}
                        >
                            Print
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default YearLevelModal;
