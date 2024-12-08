import React from 'react';
import SideBarLogo from './SideBarLogo'; 
import SideBarTexture from './SideBarTexture'; 
import SideBarNavList from './SideBarNavList'; 

const SideBar = ({ userRole }) => {
  return (
    <SideBarTexture>
      {/* Sidebar Logo */}
      <div className="sidebar-logo">
        <SideBarLogo />
      </div>

      {/* Line Separator */}
      <div className="separator"></div>

      {/* Navigation Links */}
      <div className="sidebar-nav">
        <SideBarNavList userRole={userRole} /> {/* Pass the userRole to SideBarNavList */}
      </div>
    </SideBarTexture>
  );
};

export default SideBar;
