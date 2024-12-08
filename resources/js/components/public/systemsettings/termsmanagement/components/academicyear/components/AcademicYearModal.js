// AcademicYearModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Form, message } from 'antd';

const AcademicYearModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateAcademicYear, // Handler for creating an academic year
    handleEditAcademicYear,   // Handler for editing an academic year
    modalData,                // Data to prefill the form when editing
    existingAcademicYears,    // Array of existing academic years
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with existing academic year data when editing
            form.setFieldsValue({
                academic_year: modalData.academic_year,
            });
        } else if (isCreateModalVisible) {
            form.resetFields(); // Reset form fields when creating
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // Handle form submission
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const academicYear = values.academic_year.trim();

                // Basic validation for format YYYY-YYYY
                const academicYearRegex = /^\d{4}-\d{4}$/;
                if (!academicYearRegex.test(academicYear)) {
                    message.error('Please enter a valid academic year in the format YYYY-YYYY.');
                    return;
                }

                // Check if the start year is less than the end year
                const [startYear, endYear] = academicYear.split('-').map((year) => parseInt(year, 10));
                if (startYear >= endYear) {
                    message.error('The start year must be earlier than the end year.');
                    return;
                }

                if (isEditModalVisible) {
                    // Invoke the edit handler with academic year ID and updated data
                    handleEditAcademicYear(modalData.id, { 
                        academic_year: academicYear,
                    });
                } else {
                    // Invoke the create handler with new academic year data
                    handleCreateAcademicYear({ 
                        academic_year: academicYear,
                    });
                }

                form.resetFields(); // Reset the form after submission
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    // Handle modal cancellation
    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); // Reset the form when modal is closed
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Academic Year' : 'Create New Academic Year'}
            visible={isCreateModalVisible || isEditModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Academic Year'}
            cancelText="Cancel"
            destroyOnClose // Ensure form is reset when modal is closed
        >
            <Form form={form} layout="vertical" name="academicYearForm">
                <Form.Item
                    label="Academic Year"
                    name="academic_year"
                    rules={[
                        { required: true, message: 'Please enter an academic year!' },
                        { pattern: /^\d{4}-\d{4}$/, message: 'Academic year must be in the format YYYY-YYYY.' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                const formattedValue = value.trim().toLowerCase();
                                const duplicate = existingAcademicYears.some(year => 
                                    year.academic_year.toLowerCase() === formattedValue && year.id !== (modalData ? modalData.id : null)
                                );
                                if (duplicate) {
                                    return Promise.reject(new Error('This Academic Year already exists.'));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input 
                        placeholder="Enter academic year (e.g., 2024-2025)" 
                        maxLength={9} // 4 digits + hyphen + 4 digits
                        onChange={(e) => {
                            let inputValue = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters

                            if (inputValue.length > 8) {
                                inputValue = inputValue.substring(0, 8); // Restrict input to 8 digits (YYYYYYYY)
                            }

                            if (inputValue.length > 4) {
                                inputValue = `${inputValue.slice(0, 4)}-${inputValue.slice(4, 8)}`;
                            }

                            form.setFieldsValue({ academic_year: inputValue });
                        }}
                        inputMode="numeric" // Hint for mobile devices to show numeric keypad
                    />
                </Form.Item>
            </Form>
            {/* You can display additional information or error messages here if needed */}
        </Modal>
    );
};

export default AcademicYearModal;