import React, { useState } from "react";
import { Layout, theme } from "antd";
import SideBar from "./SideBar"; // Custom Sidebar
import Header from "./Header"; // Custom Header
import MobileSidebarToggle from './MobileSidebarToggle'; // Import mobile sidebar toggle component

const { Sider, Content } = Layout;

const MainDashboard = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken(); // Dynamic theme styling

  // State for Sidebar collapse (desktop view)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false); // State for mobile sidebar visibility

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed); // Toggle sidebar visibility for desktop
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarVisible(!mobileSidebarVisible); // Toggle sidebar visibility for mobile
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for larger screens */}
      <Sider
        width={250}
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={sidebarCollapsed} // Handle collapse state for desktop
        onCollapse={(collapsed) => setSidebarCollapsed(collapsed)} // Update collapse state
        style={{
          position: "fixed", // Keep the sidebar fixed on larger screens
          height: "100vh",
          zIndex: 1,
        }}
      >
        <SideBar userRole="superadmin" />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: sidebarCollapsed ? 0 : 250, transition: 'margin-left 0.3s' }}>
        {/* Mobile Sidebar Toggle Button */}
        <MobileSidebarToggle 
          userRole="superadmin" 
          mobileSidebarVisible={mobileSidebarVisible} 
          toggleMobileSidebar={toggleMobileSidebar} 
        />

        {/* Header */}
        <Header 
          style={{ padding: 0, background: colorBgContainer }} 
          toggleSidebar={toggleSidebar} 
          toggleMobileSidebar={toggleMobileSidebar}
        />

        {/* Content Area */}
        <Content style={{ margin: "24px 16px 0", paddingTop: '80px' }}> {/* Add padding-top to push content down */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children} {/* Render children here */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainDashboard;
