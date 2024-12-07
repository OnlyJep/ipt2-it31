import React from 'react';
import { Result, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import loginLogo from '../../../../public/images/loginpagebackground.svg';
import fsuu from '../../../../public/images/loginlogo.svg'; // Your new image

const { Title, Text } = Typography;

const UnauthorizedPage = () => {
  const backgroundStyle = {
    backgroundImage: `url(${loginLogo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', // Full viewport height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyle = {
    color: 'white',
  };

  const titleStyle = {
    color: '#ff4d4f', // Red color for the 403 title
    fontSize: '64px', // Large title size
    fontWeight: 'bold', // Make the title bold
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)', // Add a text shadow
  };

  const subTitleStyle = {
    color: 'white',
    fontSize: '18px', // Slightly smaller than the title
    textAlign: 'center',
    marginTop: '20px', // Add some space above the subtitle
  };

  return (
    <div style={backgroundStyle}>
      <Result
        status="403"
        title={<Title level={1} style={titleStyle}>403</Title>}
        subTitle={<Text style={subTitleStyle}>You do not have permission to access this page.</Text>}
        icon={<img src={fsuu} alt="Login Logo" style={{ width: 100, height: 100 }} />}
        extra={
          <Button type="primary">
            <Link to="/">Go to Home</Link>
          </Button>
        }
      />
    </div>
  );
};

export default UnauthorizedPage;
