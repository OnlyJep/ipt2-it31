// Loader.js
import React from 'react';
import { Spin, Space } from 'antd';

const Loader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }}
  >
    <Space size="middle">
      <Spin size="large" />
    </Space>
  </div>
);

export default Loader;
