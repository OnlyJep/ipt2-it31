import React, { useState, useEffect } from "react";
import { Layout, theme, Spin } from "antd";
import Header from "./Header"; // Custom Header
import MobileSidebarToggle from './MobileSidebarToggle'; // Import mobile sidebar toggle component
import { useMediaQuery } from 'react-responsive';

const { Sider, Content } = Layout;
const SideBar = React.lazy(() => import("./SideBar")); // Lazy-loaded Sidebar

const MainDashboard = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken(); // Dynamic theme styling

  // State for Sidebar collapse (desktop view)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false); // State for mobile sidebar visibility
  const [userRole, setUserRole] = useState(null); // State for user role (null initially)
  const [isLoaded, setIsLoaded] = useState(false); // Loading state to ensure userRole is set before render
  const [isMobile, setIsMobile] = useState(false); // Track if we are in mobile view

  // Effect to check for the user role
  useEffect(() => {
    const savedRole = localStorage.getItem("user_role");
    if (savedRole) {
      setUserRole(savedRole);
    } else {
      setUserRole("guest");
    }
    setIsLoaded(true);
  }, []);

  // Effect to detect screen width changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsMobile(true); // Treat as mobile if screen width is less than 992px
        setSidebarCollapsed(false); // Un-collapse the desktop sidebar on mobile (if needed)
        setMobileSidebarVisible(false); // Hide the mobile sidebar when switching to mobile
      } else {
        setIsMobile(false); // Treat as desktop if screen width is greater than 992px
        setMobileSidebarVisible(false); // Hide the mobile sidebar when switching to desktop
      }
    };

    // Call handleResize once on mount to set initial state
    handleResize();

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed); // Toggle sidebar visibility for desktop
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarVisible(!mobileSidebarVisible); // Toggle sidebar visibility for mobile
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for larger screens */}
      {!isMobile && (
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
          <SideBar userRole={userRole} /> {/* Pass userRole to the Sidebar */}
        </Sider>
      )}

      {/* Main Layout */}
      <Layout style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? 0 : 250, transition: 'margin-left 0.3s' }}>
        {/* Mobile Sidebar Toggle Button */}
        {isMobile && (
          <MobileSidebarToggle 
            userRole={userRole} 
            mobileSidebarVisible={mobileSidebarVisible} 
            toggleMobileSidebar={toggleMobileSidebar} 
          />
        )}

        {/* Header */}
        <Header 
          style={{ padding: 0, background: colorBgContainer }} 
          toggleSidebar={toggleSidebar} 
          toggleMobileSidebar={toggleMobileSidebar}
        />

        {/* Content Area */}
        <Content style={{ marginTop: '64px', margin: "24px 16px 0" }}> {/* Offset content by header height */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Render loading spinner only for content area */}
            {isLoaded ? children : <Spin size="large" />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainDashboard;
