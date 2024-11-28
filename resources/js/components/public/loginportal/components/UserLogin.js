import React, { useState } from 'react';
import { Layout, Form, Input, Button, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import LoginBackground from './../../../../../../public/images/loginbackground.svg';

const { Content } = Layout;

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values) => {
    try {
      const response = await axios.post('/api/login', values);
      if (response.status === 200) {
        message.success('Login successful!');
        // You can handle redirection or storing tokens here
      }
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundImage: `url(${loginBackground})`, backgroundSize: 'cover' }}>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col xs={20} sm={16} md={12} lg={8} xl={6}>
            <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
              <Form
                name="loginForm"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    iconRender={(visible) => (
                      <Button
                        type="link"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {visible ? 'Hide' : 'Show'}
                      </Button>
                    )}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default UserLogin;