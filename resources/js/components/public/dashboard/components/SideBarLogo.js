import React from 'react';
import { useNavigate } from 'react-router-dom';

const SideBarLogo = () => {
  const navigate = useNavigate();
  
  // Get the user role from localStorage
  const userRole = localStorage.getItem('user_role');
  
  // Set the styles
  const logoStyle = {
    width: '180px',
    height: 'auto',
    marginTop: '16px',
    transition: 'transform 0.3s ease',  // Transition for zoom effect
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px',
    cursor: 'pointer',  // Make the logo look clickable
  };

  const logoHoverStyle = {
    transform: 'scale(1.1)',  // Zoom effect when hovered
  };

  const handleLogoClick = () => {
    // Navigate to the correct dashboard based on the user role
    if (userRole) {
      navigate(`/${userRole}/dashboard`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="logo"
      style={containerStyle}
    >
      <img
        src={require('../../../../../../public/images/sidebarlogo.svg').default}
        alt="Sidebar Logo"
        style={logoStyle}
        onClick={handleLogoClick}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      />
    </div>
  );
};

export default SideBarLogo;
