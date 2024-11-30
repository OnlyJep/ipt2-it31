import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Form, Input, Button, Row, Col, Divider, Upload, message, Avatar, Select, Spin, Descriptions } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import MainDashboard from '../dashboard/components/MainDashboard';

const { Content } = Layout;
const { Option } = Select;

const ProfilePageDashboard = () => {
    const [isEditing, setIsEditing] = useState(true); // Toggle between edit and view mode
    const [form] = Form.useForm();
    const [userData, setUserData] = useState(null); // State to hold user data
    const [isLoading, setIsLoading] = useState(false); // State to manage loading
    const [isUploading, setIsUploading] = useState(false); // State for photo upload progress

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/api/user/profile');
                setUserData(response.data);
                form.setFieldsValue(response.data); // Populate form with user data
            } catch (error) {
                message.error('Failed to load user data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [form]);

    // Handle profile save
    const handleSave = async () => {
        try {
            setIsEditing(false); // Switch to view mode
            const values = await form.validateFields();
            const response = await axios.put('/api/user/profile', values); // API call to save user data
            message.success('Profile saved successfully!');
        } catch (error) {
            message.error('Failed to save profile');
        }
    };

    // Toggle edit mode
    const handleEdit = () => {
        setIsEditing(true); // Switch to edit mode
    };

    // Handle photo upload
    const handlePhotoChange = (info) => {
        if (info.file.status === 'done') {
            const photoUrl = info.file.response?.url; // Assuming the API returns a URL for the uploaded photo
            form.setFieldsValue({ photo: photoUrl }); // Set the photo URL in form
        }
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
    <Col style={{ marginRight: '20px' }}> {/* Adjusting margin to move button away from scrollbar */}
        <Button onClick={isEditing ? handleSave : handleEdit} type="primary">
            {isEditing ? 'Save Info' : 'Edit Info'}
        </Button>
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
                            {/* Avatar */}
                            <Avatar
                                size={150}
                                src={userData?.photo}
                                icon={<UserOutlined />}
                                style={{ marginBottom: '20px' }}
                            />
                            <Upload
                                name="photo"
                                showUploadList={false}
                                action="/api/upload/photo"
                                onChange={handlePhotoChange}
                                beforeUpload={() => false}
                                accept="image/*"
                            >
                                <Button
                                    icon={<PlusOutlined />}
                                    type="dashed"
                                    style={{ marginTop: '20px' }}
                                    loading={isUploading}
                                >
                                    {isUploading ? 'Uploading...' : 'Add Photo'}
                                </Button>
                            </Upload>
                        </Col>

                        {/* Personal Information Form or Descriptions */}
                        <Col xs={24} sm={16} md={18} lg={16} xl={14}>
                            {isEditing ? (
                                <Form form={form} layout="vertical">
                                    <Row gutter={[16, 24]}>
                                        <Col xs={24} sm={12} md={8}>
                                            <Form.Item label="Firstname" name="firstname">
                                                <Input placeholder="Firstname" prefix={<UserOutlined />} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <Form.Item label="Middle Initial" name="middleinitial">
                                                <Input placeholder="Middle Initial" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <Form.Item label="Lastname" name="lastname">
                                                <Input placeholder="Lastname" prefix={<UserOutlined />} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 24]}>
                                        <Col xs={24} sm={12} md={8}>
                                            <Form.Item label="Suffix (Optional)" name="suffix">
                                                <Input placeholder="Suffix (Optional)" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <Form.Item label="Age" name="age">
                                                <Input type="number" placeholder="Age" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <Form.Item label="Date of Birth" name="dob">
                                                <Input type="date" placeholder="Date of Birth" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 24]}>
                                        <Col xs={24} sm={12} md={8}>
                                            <Form.Item label="Sex" name="sex">
                                                <Select placeholder="Select Sex">
                                                    <Option value="male">Male</Option>
                                                    <Option value="female">Female</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <Form.Item label="Phone Number" name="phoneNumber">
                                                <Input placeholder="Phone Number" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <Form.Item label="Marital Status" name="maritalStatus">
                                                <Select placeholder="Select Marital Status">
                                                    <Option value="single">Single</Option>
                                                    <Option value="married">Married</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <Form.Item label="Religion" name="religion">
                                                <Select placeholder="Select Religion">
                                                    <Option value="romanCatholic">Roman Catholic</Option>
                                                    <Option value="muslim">Muslim</Option>
                                                    <Option value="other">Other</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 24]}>
                                        <Col xs={24} sm={24} md={24}>
                                            <Form.Item label="Address" name="address">
                                                <Input.TextArea placeholder="Address" rows={4} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            ) : (
                                <Descriptions title="User Information" bordered>
                                    <Descriptions.Item label="Firstname">{userData?.firstname}</Descriptions.Item>
                                    <Descriptions.Item label="Middle Initial">{userData?.middleinitial}</Descriptions.Item>
                                    <Descriptions.Item label="Lastname">{userData?.lastname}</Descriptions.Item>
                                    <Descriptions.Item label="Suffix (Optional)">{userData?.suffix}</Descriptions.Item>
                                    <Descriptions.Item label="Age">{userData?.age}</Descriptions.Item>
                                    <Descriptions.Item label="Date of Birth">{userData?.dob}</Descriptions.Item>
                                    <Descriptions.Item label="Sex">{userData?.sex}</Descriptions.Item>
                                    <Descriptions.Item label="Marital Status">{userData?.maritalStatus}</Descriptions.Item>
                                    <Descriptions.Item label="Religion">{userData?.religion}</Descriptions.Item>
                                    <Descriptions.Item label="Phone Number">{userData?.phoneNumber}</Descriptions.Item>
                                    <Descriptions.Item label="Address">{userData?.address}</Descriptions.Item>
                                </Descriptions>
                            )}
                        </Col>
                    </Row>
                </div>
            </Content>
        </MainDashboard>
    );
};

export default ProfilePageDashboard;
