import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests
import { Layout, Row, Col, Input, Tabs, Spin, Alert, Card } from 'antd'; // Import necessary Ant Design components
import { debounce } from 'lodash'; // Debounce function to prevent excessive search calls
import TeacherTimetable from './TeacherTimetable'; // Import TeacherTimetable component
import TeacherProfiles from './TeacherProfiles'; // Import TeacherProfiles component
import TeacherAssignment from './TeacherAssignment'; // Import TeacherAssignment component

const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

const FacultyPageDashboard = () => {
    const [searchQuery, setSearchQuery] = useState(''); // State to store search query
    const [teachers, setTeachers] = useState([]); // State to store fetched teacher profiles
    const [timetable, setTimetable] = useState([]); // State to store fetched teacher timetables
    const [assignments, setAssignments] = useState([]); // State to store teacher assignments
    const [loading, setLoading] = useState(true); // Loading state for API calls
    const [error, setError] = useState(null); // Error state

    // Fetch data from API when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading

                // Fetch teacher profiles
                const teacherResponse = await axios.get('https://api.example.com/teachers'); // Replace with your API endpoint
                setTeachers(teacherResponse.data);

                // Fetch teacher timetable
                const timetableResponse = await axios.get('https://api.example.com/timetable'); // Replace with your API endpoint
                setTimetable(timetableResponse.data);

                // Fetch teacher assignments
                const assignmentsResponse = await axios.get('https://api.example.com/assignments'); // Replace with your API endpoint
                setAssignments(assignmentsResponse.data);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs only once

    // Debounced search query handler (to reduce the frequency of API calls)
    const handleSearchChange = debounce((value) => {
        setSearchQuery(value); // Update the search query in state
    }, 500); // Delay the search for 500ms after the user stops typing

    return (
        <Content style={{ padding: '20px', minHeight: '280px' }}>
            {/* Search Bar */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={24}>
                    <Search
                        placeholder="Search for profiles, timetable, or assignments"
                        onSearch={handleSearchChange} // Trigger search on pressing enter
                        onChange={(e) => handleSearchChange(e.target.value)} // Trigger search as user types
                        value={searchQuery}
                        enterButton="Search"
                        size="large"  // Adjusting the size of the search bar to 'large'
                        style={{
                            width: '100%',  // Makes the search bar take the full width of its container
                            maxWidth: '600px', // Limit the width of the search bar to a max of 600px
                        }}
                    />
                </Col>
            </Row>

            {/* Loading Spinner */}
            {loading && (
                <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                </div>
            )}

            {/* Error Message */}
            {error && <Alert message={error} type="error" showIcon />}

            {/* Tabs Layout */}
            <Tabs defaultActiveKey="1">
                {/* Teacher Profiles Tab */}
                <TabPane tab="Teacher Profiles" key="1">
                    <Row gutter={[16, 16]}>
                        {teachers
                            .filter(teacher => teacher.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(teacher => (
                                <Col
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={6}
                                    xl={4}
                                    key={teacher.id}
                                    style={{
                                        padding: '8px', // Add padding between items
                                    }}
                                >
                                    <Card
                                        hoverable
                                        title={teacher.name}
                                        extra={<a href="#">More</a>}
                                        style={{
                                            width: '100%',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Shadow effect for the card
                                        }}
                                    >
                                        <p>{teacher.subject}</p>
                                        <p>{teacher.email}</p>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                </TabPane>

                {/* Teacher Timetable Tab */}
                <TabPane tab="Teacher Timetable" key="2">
                    <TeacherTimetable timetable={timetable} searchQuery={searchQuery} />
                </TabPane>

                {/* Teacher Assignments Tab */}
                <TabPane tab="Teacher Assignments" key="3">
                    <TeacherAssignment assignments={assignments} searchQuery={searchQuery} />
                </TabPane>
            </Tabs>
        </Content>
    );
};

export default FacultyPageDashboard;
