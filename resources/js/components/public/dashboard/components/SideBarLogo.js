// src/components/SideBar/SideBarLogo.js

import React from 'react';

const SideBarLogo = () => {
  return (
    <div className="logo">
      <img
        src={require('../../../../../../public/images/sidebarlogo.svg').default}
        alt="Sidebar Logo"
      />
    </div>
  );
};

export default SideBarLogo;
