import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Row, Col, message, Tooltip, Card, Spin } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import navigate hook
import LoginPageBackground from './components/LoginPageBackground';
import LoginLogo from './components/LoginLogo';
import LoginLoader from './components/LoginLoader'; // Import the loader component

const { Content } = Layout;

const UserLogin = ({ setUserRole }) => {
  const [showPassword, setShowPassword] = useState(false); // Show password toggle
  const [loading, setLoading] = useState(false); // Login loading spinner
  const [pageLoading, setPageLoading] = useState(true); // Page load state
  const [showContent, setShowContent] = useState(false); // State to control when to show login content
  const [errorMessage, setErrorMessage] = useState(''); // Track error message state
  const navigate = useNavigate(); // Initialize navigate function

  // Simulate page load (replace with real data fetching or async tasks as needed)
  useEffect(() => {
    const loadPageContent = async () => {
      try {
        await fetchDataForPage();
        setPageLoading(false); // Hide page loader
        setShowContent(true); // Show login content
      } catch (error) {
        console.error('Error loading page content:', error);
        setPageLoading(false); // Ensure page loads even in case of error
      }
    };

    loadPageContent(); // Call the async function on component mount
  }, []);

  const fetchDataForPage = async () => {
    return new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2 seconds delay
  };

  const onFinish = async (values) => {
    setLoading(true); // Show spinner when login is in progress
    setErrorMessage(''); // Reset error message before each submission
  
    try {
      const response = await axios.post('/api/login', values, { timeout: 10000 }); // 10 seconds timeout
      if (response.status === 200) {
        message.success('Login successful!');
        localStorage.setItem('auth_token', response.data.token); // Store token
        localStorage.setItem('user_role', response.data.role); // Save role in localStorage
  
        // Set user role state in the parent component
        setUserRole(response.data.role);
  
        // Use the navigate hook for redirect
        navigate(response.data.role === 'superadmin' ? '/superadmin/dashboard' : '/admin/dashboard');
      }
    } catch (error) {
      // Check if error is related to network or server
      if (error.response) {
        setErrorMessage('Login failed. Please check your Username and Password credentials.');
        message.error('Login failed. Please check your Username and Password credentials.');
      } else if (error.request) {
        // No response from server
        setErrorMessage('Server is not responding. Please try again later.');
        message.error('Server is not responding. Please try again later.');
      } else {
        // General error
        setErrorMessage('An error occurred. Please try again later.');
        message.error('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); // Hide spinner after login attempt
    }
  };
  

  const onFinishFailed = (errorInfo) => {
    // Only show error message from validation if the API hasn't been called yet
    if (!errorMessage) {
      message.error('Login failed. Please check your Username and Password credentials.');
    }
    console.log('Failed:', errorInfo); // Optional: Log validation error information
  };

  return (
    <>
      {pageLoading && (
        <LoginPageBackground>
          <LoginLoader /> {/* Display loader on top of the background */}
        </LoginPageBackground>
      )}

      {!pageLoading && (
        <LoginPageBackground>
          {showContent && (
            <Content
              className="content-container"
              style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 20, // Higher z-index to appear above the loader and background
              }}
            >
              <Row justify="center" align="middle" style={{ width: '100%' }}>
                <Col xs={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <LoginLogo />
                </Col>
                <Col xs={24} sm={20} md={12} lg={10} style={{ marginTop: '-30px' }}>
                  <Card
                    bordered={false}
                    className="card-container"
                    style={{
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Form
                      name="loginForm"
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                    >
                      <div
                        style={{
                          marginBottom: '16px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          textAlign: 'center',
                        }}
                      >
                        Account Portal
                      </div>
                      <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}>
                        <Input
                          prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                          placeholder="Username"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>

                      <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}>
                        <Input.Password
                          prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          iconRender={(visible) => (
                            <Tooltip title={visible ? 'Hide Password' : 'Show Password'}>
                              {visible ? (
                                <EyeTwoTone onClick={() => setShowPassword(!showPassword)} />
                              ) : (
                                <EyeInvisibleOutlined onClick={() => setShowPassword(!showPassword)} />
                              )}
                            </Tooltip>
                          )}
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>

                      <Form.Item style={{ textAlign: 'center' }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{
                            width: '100%',
                            borderRadius: '8px',
                            backgroundColor: '#131f73',
                            borderColor: '#131f73',
                            height: '40px',
                          }}
                          loading={loading} // Show spinner on button during login
                        >
                          {loading ? 'Logging in...' : 'Login'} {/* Show spinner when loading */}
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </Content>
          )}
        </LoginPageBackground>
      )}
    </>
  );
};

export default UserLogin;
