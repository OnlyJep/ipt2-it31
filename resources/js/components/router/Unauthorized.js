import React, { useState, useEffect } from 'react';
import { Result, Button, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import loginLogo from '../../../../public/images/loginpagebackground.svg';
import fsuu from '../../../../public/images/loginlogo.svg'; // Your new image

const { Title, Text } = Typography;

const UnauthorizedPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [timeLeft, setTimeLeft] = useState(10); // Initialize the timer with 10 seconds

  // Set up automatic redirect after 10 seconds
  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/'); // Redirect to the homepage when time is up
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); // Decrease the time left by 1 second
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const backgroundStyle = {
    backgroundImage: `url(${loginLogo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', // Full viewport height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
      {/* Timer and redirect message */}
      <Tag
        color="transparent"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 15px',
          fontSize: '16px',
          border: '1px solid white',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        Redirecting in {timeLeft}s
      </Tag>

      {/* Main content */}
      <Result
        status="403"
        title={<Title level={1} style={titleStyle}>403</Title>}
        subTitle={<Text style={subTitleStyle}>You are not authorized to view this page.</Text>}
        extra={[
          <Button type="primary" key="console" href="/">
            Go to Homepage
          </Button>,
        ]}
      />
    </div>
  );
};

export default UnauthorizedPage;

