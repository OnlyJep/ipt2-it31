// src/components/SideBar/SideBarTexture.js

import React from 'react';

const SideBarTexture = ({ children }) => {
  const sidebarStyle = {
    width: '250px',  // Default width for larger screens
    height: '100vh',
    backgroundColor: '#131f73',
    backgroundImage: `url(${require('../../../../../../public/images/sidebartexture.svg').default})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    transition: 'width 0.3s ease',  // Optional: Add transition for smooth resizing
  };

  // Adding inline CSS for mobile responsiveness
  const mediaQuery = `
    @media (max-width: 480px) {
      .sidebar {
        width: 100px !important;
      }
    }
  `;

  return (
    <div className="sidebar" style={sidebarStyle}>
      {/* Inject the media query */}
      <style>{mediaQuery}</style>
      {children}
    </div>
  );
};

export default SideBarTexture;
