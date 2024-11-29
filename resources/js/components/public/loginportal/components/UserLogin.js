import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Row, Col, message, Tooltip, Card, Spin } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import axios from 'axios';
import LoginPageBackground from './LoginPageBackground';
import LoginLogo from './LoginLogo';

const { Content } = Layout;

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true); // Page load state

  // Simulate loading on page load
  useEffect(() => {
    // Simulating an API call or delay to show the loading spinner
    const loadPage = async () => {
      // Simulate a delay (e.g., an API request or data fetching)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      setLoading(false); // Set loading to false once the page is ready
    };

    loadPage();
  }, []);

  const onFinish = async (values) => {
    setLoading(true); // Show loading spinner when API request starts
    try {
      const response = await axios.post('/api/login', values);
      if (response.status === 200) {
        message.success('Login successful!');
        // Handle redirection or token storage here
      }
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Hide loading spinner after response is received
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <LoginPageBackground>
      <Content
        className="content-container"
        style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Row justify="center" align="middle" style={{ width: '100%' }}>
          {/* Logo Column */}
          <Col xs={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
            <LoginLogo />
          </Col>

          {/* Login Form Column */}
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
                  rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                    placeholder="Username"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
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
                    loading={loading} // Set loading state for the button
                  >
                    {loading ? <Spin /> : 'Login'} {/* Show spinner when loading */}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </LoginPageBackground>
  );
};

export default UserLogin;
