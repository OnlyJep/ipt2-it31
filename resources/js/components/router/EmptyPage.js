
import React, { useState, useEffect } from 'react';
import { Result, Button, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import loginLogo from '../../../../public/images/loginpagebackground.svg';

const { Title, Text } = Typography;

const NotFoundPage = () => {
  const navigate = useNavigate(); 
  const [timeLeft, setTimeLeft] = useState(10); 

  
  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/'); 
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); 
    }, 1000);

    
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const backgroundStyle = {
    backgroundImage: `url(${loginLogo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', 
    padding: '20px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const timerStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '5px 15px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: '5px',
    color: 'white',
    fontWeight: 'bold',
  };

  return (
    <div style={backgroundStyle}>
      {}
      <div style={timerStyle}>
        <Text style={{ color: 'white' }}>Redirecting in {timeLeft} seconds</Text>
      </div>

      {}
      <Result
        status="404"
        title={<Title level={1} style={{ color: 'white' }}>404</Title>}
        subTitle={<Text style={{ color: 'white' }}>Sorry, the page you are looking for does not exist.</Text>}
        extra={
          <Button type="primary">
            <a href="/">Back to Home</a>
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;
