import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Row, Col, Card, Statistic, Breadcrumb, Typography, Divider, Spin } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainDashboard from '../dashboard/components/MainDashboard';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const DashboardPageDashboard = () => {
    const [data, setData] = useState({ enrolledStudents: 0, totalInstructors: 0 }); // Default values
    const [activeUsers, setActiveUsers] = useState(0); // Default value
    const [totalCourses, setTotalCourses] = useState(0); // Default value
    const [totalInstructors, setTotalInstructors] = useState(null); // State for instructors count
    const [totalStudents, setTotalStudents] = useState(null); // State for total students
    const [currentSection, setCurrentSection] = useState('Analytics');
    const [loading, setLoading] = useState(true);
    const [loadingActiveUsers, setLoadingActiveUsers] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingInstructors, setLoadingInstructors] = useState(true); // State for loading instructors
    const [loadingStudents, setLoadingStudents] = useState(true); // State for loading students
    const location = useLocation();

    const getAuthToken = () => localStorage.getItem('auth_token');

    const makeAuthenticatedRequest = async (url, setLoadingState, handleResponse, handleError) => {
        try {
            setLoadingState(true);

            const token = getAuthToken();
            if (!token) {
                console.error("Authentication token not found.");
                return;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            handleResponse(response.data);
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);

            if (handleError) handleError(error);
        } finally {
            setLoadingState(false);
        }
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/analytics');
            setData(response.data || {});
        } catch (error) {
            console.error("Error fetching analytics data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTotalCourses = useCallback(async () => {
        await makeAuthenticatedRequest(
            '/api/collegeprogram/total/count',
            setLoadingCourses,
            (data) => setTotalCourses(data.totalCourses || 0),
            (error) => console.error("Error fetching total courses:", error)
        );
    }, []);

    const fetchActiveUsers = useCallback(async () => {
        await makeAuthenticatedRequest(
            '/api/users/active/count',
            setLoadingActiveUsers,
            (data) => setActiveUsers(data.totalUsersNotDeleted || 0)
        );
    }, []);

    const fetchTotalInstructors = useCallback(async () => {
        await makeAuthenticatedRequest(
            '/api/profiles/instructors/totalcount',
            setLoadingInstructors,
            (data) => setTotalInstructors(data.totalInstructors || 0), // Default to 0 if the field is missing
            (error) => console.error("Failed to fetch total instructors:", error) // Custom error handler
        );
    }, []);

    const fetchTotalStudents = useCallback(async () => {
        await makeAuthenticatedRequest(
            '/api/profiles/students/totalcount',
            setLoadingStudents,
            (data) => setTotalStudents(data.totalStudents || 0), // Default to 0 if missing
            (error) => console.error("Failed to fetch total students:", error) // Custom error handler
        );
    }, []);
    

    useEffect(() => {
        const section = location.pathname.split("/").pop();
        setCurrentSection(section.charAt(0).toUpperCase() + section.slice(1));
        fetchData();
        fetchActiveUsers();
        fetchTotalCourses();
        fetchTotalInstructors();
        fetchTotalStudents();
    }, [location, fetchData, fetchActiveUsers, fetchTotalCourses, fetchTotalInstructors, fetchTotalStudents]);

    return (
        <Content style={{ padding: '20px' }}>
            <Title level={1} style={{ marginBottom: '14px' }}>Analytics</Title>
            <Divider style={{ margin: '20px 0' }} />
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card
                            hoverable
                            bordered={false}
                            style={{ textAlign: 'center', backgroundColor: '#e6f7ff' }}
                        >
                            {loadingStudents ? (
                                <Spin size="small" />
                            ) : (
                                <Statistic
                                    title="Total Enrolled Students"
                                    value={totalStudents || 0} // Fallback to 0 if null
                                    prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                                    style={{ fontSize: '18px', color: '#1890ff' }}
                                />
                            )}
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card
                            hoverable
                            bordered={false}
                            style={{ textAlign: 'center', backgroundColor: '#f6ffed' }}
                        >
                            {loadingInstructors ? (
                                <Spin size="small" />
                            ) : (
                                <Statistic
                                    title="Total Instructors"
                                    value={totalInstructors || 0} // Fallback to 0 if null
                                    prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                                    style={{ fontSize: '18px', color: '#52c41a' }}
                                />
                            )}
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card hoverable bordered={false} style={{ textAlign: 'center', backgroundColor: '#fff2e8' }}>
                            {loadingCourses ? <Spin size="small" /> : <Statistic title="Total Courses" value={totalCourses} prefix={<FileTextOutlined style={{ color: '#ff4d4f' }} />} />}
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card hoverable bordered={false} style={{ textAlign: 'center', backgroundColor: '#fff7e6' }}>
                            {loadingActiveUsers ? <Spin size="small" /> : <Statistic title="Total Active Users" value={activeUsers} prefix={<AppstoreAddOutlined style={{ color: '#faad14' }} />} />}
                        </Card>
                    </Col>
                </Row>
            )}
        </Content>
    );
};

const DashboardPage = () => {
    return (
        <MainDashboard>
            <DashboardPageDashboard />
        </MainDashboard>
    );
};

export default DashboardPage;
