import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Button, Descriptions, Row, Col, Divider, Upload, message, Avatar, Spin, Form } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import MainDashboard from '../dashboard/components/MainDashboard';
import ProfileForm from './components/ProfileForm';

const { Content } = Layout;

const ProfilePageDashboard = () => {
    const [isEditing, setIsEditing] = useState(false); // Default to view mode
    const [form] = Form.useForm(); // Initialize form instance
    const [userData, setUserData] = useState(null); // State to hold user data
    const [profileData, setProfileData] = useState(null); // State to hold profile data
    const [isLoading, setIsLoading] = useState(true); // State to manage loading
    const [isUploading, setIsUploading] = useState(false); // State for photo upload progress
    const [uploadMessage, setUploadMessage] = useState(''); // Message state for upload success/error
    const [selectedPhoto, setSelectedPhoto] = useState(null); // State to track selected photo
    const [photoPreview, setPhotoPreview] = useState(null); // State to hold the preview URL



    // Fetch user data and profile data when component mounts
    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                const profileId = localStorage.getItem('profile_id');
                if (!profileId) {
                    message.error('Profile ID not found. Please log in again.');
                    return;
                }

                const token = localStorage.getItem('auth_token');
                if (!token) {
                    message.error('No token found. Please log in.');
                    return;
                }

                const response = await axios.get(`/api/profiles/${profileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProfileData(response.data); // Set the profile data
                setUserData(response.data); // Assuming user data includes profile info as well

                // Map the profile data to form fields
                form.setFieldsValue({
                    firstname: response.data.first_name,
                    middleinitial: response.data.middle_initial,
                    lastname: response.data.last_name,
                    sex: response.data.sex,
                    maritalStatus: response.data.marital_status,
                    religion: response.data.religion,
                    age: response.data.age,
                    phoneNumber: response.data.phone_number,
                    address: response.data.address,
                });

            } catch (error) {
                console.error(error);
                message.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [form]);

    // Handle profile save
    const handleSave = async () => {
        try {
            const values = await form.validateFields(); // Get form values
            const token = localStorage.getItem('auth_token'); // Get the token
            const profileId = localStorage.getItem('profile_id'); // Retrieve profile_id from localStorage
            
            if (!profileId) {
                message.error('Profile ID not found in localStorage');
                return;
            }
    
            // Map frontend fields to backend fields
            const mappedValues = {
                first_name: values.firstname,
                middle_initial: values.middleinitial,
                last_name: values.lastname,
                sex: values.sex,
                marital_status: values.maritalStatus,
                religion: values.religion,
                age: values.age,
                phone_number: values.phoneNumber,
                address: values.address,
            };
    
            // If a new photo was selected, upload it
            if (selectedPhoto) {
                const formData = new FormData();
                formData.append('photo', selectedPhoto);
                formData.append('profile_id', profileId);
    
                try {
                    await axios.post('/api/upload-photo', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                        },
                    });
                    setUploadMessage('Photo uploaded successfully.');
                } catch (error) {
                    setUploadMessage('Failed to upload photo.');
                }
            }
    
            // Send the PUT request to update the profile (with or without the photo)
            const response = await axios.put(`/api/profiles/${profileId}`, mappedValues, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            // On success, show success message
            message.success('Profile updated successfully');
            setIsEditing(false); // Switch to view mode after saving
        } catch (error) {
            console.error(error);
            message.error('Failed to update profile');
        }
    };
    

    // Toggle edit mode
    const handleEdit = () => {
        setIsEditing(true); // Switch to edit mode
    };

    // Handle photo upload
    const handleUpload = (file) => {
        // Temporarily store the selected photo in the state
        setSelectedPhoto(file);
    
        // Create a temporary URL to preview the selected photo
        const imageUrl = URL.createObjectURL(file);
    
        // Update the preview state with the URL of the selected photo
        setPhotoPreview(imageUrl);
    
        // Update the upload message to inform the user that the photo is selected
        setUploadMessage('Photo selected. Save info to upload the photo.');
    };    
    
    
    const handleCancel = () => {
        setIsEditing(false); // Switch back to view mode
    };
    

    // Show loading spinner while data is being fetched
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <MainDashboard>
            <Content style={{ padding: '20px' }}>
                <div style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                    <Col>
                        <h2>Account</h2>
                    </Col>
                    <Col style={{ marginRight: '20px' }}>
                        {isEditing ? (
                            <>
                                {/* Save Info Button */}
                                <Button onClick={handleSave} type="primary">
                                    Save Info
                                </Button>

                                {/* Cancel Button */}
                                <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            // Edit Info Button
                            <Button onClick={handleEdit} type="primary">
                                Edit Info
                            </Button>
                        )}
                    </Col>
                </Row>


                    <Divider />

                    {/* Personal Information Section */}
                    <Row justify="center" gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24}>
                            <Divider orientation="left" style={{ marginBottom: '28px' }}>Personal Information</Divider>
                        </Col>
                    </Row>

                    <Row justify="start" gutter={[16, 16]} style={{ marginBottom: '40px' }}>
                        <Col xs={24} sm={8} md={6} lg={4} style={{ textAlign: 'center' }}>
                            <Avatar
                                size={150}
                                src={photoPreview || (profileData?.photo_path ? `/storage/${profileData.photo_path}` : undefined)}
                                icon={<UserOutlined />}
                                style={{ marginBottom: '20px' }}
                            />

                            {isEditing && (
                                <Upload
                                    name="photo"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        handleUpload(file); // Call handleUpload to store the photo and create the preview
                                        return false; // Prevent auto-upload
                                    }}
                                >
                                    <Button
                                        icon={<PlusOutlined />}
                                        type="dashed"
                                        style={{ marginTop: '20px' }}
                                    >
                                        {selectedPhoto ? 'Photo Selected. Save to upload.' : 'Update Photo'}
                                    </Button>
                                </Upload>
                            )}

                            {uploadMessage && (
                                <div style={{ marginTop: '10px', color: uploadMessage.includes('successfully') ? 'green' : 'red' }}>
                                    {uploadMessage}
                                </div>
                            )}
                        </Col>

                        <Col xs={24} sm={16} md={18} lg={16} xl={14}>
                            <ProfileForm form={form} isEditing={isEditing} />
                        </Col>
                    </Row>

                </div>
            </Content>
        </MainDashboard>
    );
};

export default ProfilePageDashboard;
