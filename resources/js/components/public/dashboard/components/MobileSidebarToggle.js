import React from 'react';
import { Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import SideBar from './SideBar';  // Import the Sidebar component

const MobileSidebarToggle = ({ userRole, mobileSidebarVisible, toggleMobileSidebar }) => {
  // Calculate drawer width based on screen size
  const drawerWidth = window.innerWidth <= 480 ? 75 : 250; // Set to 100px on mobile, 250px on larger screens

  return (
    <>
      {/* Hamburger Menu Button for mobile */}
      <Button
        className="menu-icon"
        icon={<MenuOutlined />}
        onClick={toggleMobileSidebar}
        style={{
          display: 'none',  // Hide by default
          position: 'absolute', // Position the button on the top-left
          top: '20px', // Set top margin for the button
          left: '20px', // Set left margin for the button
          zIndex: 1000, // Ensure the button is on top
        }}
      />

      {/* Drawer for mobile sidebar */}
      <Drawer
        placement="left"
        closable={false}
        onClose={toggleMobileSidebar}
        visible={mobileSidebarVisible}
        width={drawerWidth} // Use the calculated width
        style={{
          zIndex: 1000, // Ensure it's on top of other content
        }}
        bodyStyle={{
          padding: 0, // Remove any padding inside the body
          height: '100vh', // Make the drawer fill the entire height of the screen
        }}
        wrapperStyle={{
          height: '100vh', // Make the drawer wrapper take full height
        }}
      >
        <SideBar userRole={userRole} />
      </Drawer>
    </>
  );
};

export default MobileSidebarToggle;
