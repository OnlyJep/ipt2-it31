import React from "react";
import { Layout, theme } from "antd";
import SideBar from "./SideBar";  // Custom Sidebar
import Header from "./Header";    // Custom Header

const { Sider, Content } = Layout;

const MainDashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken(); // Dynamic theme styling

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar - Reusable SideBar Component */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        width={250} // Adjust the width of the sidebar if needed
        
      >
        <SideBar /> {/* Rendering the custom SideBar component here */}
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header - Reusable Header Component */}
        <Header style={{ padding: 0, background: colorBgContainer }} />
        
        {/* Content Area */}
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Main Dashboard Content */}
            <h1>Main Dashboard Content</h1>
            {/* You can add more dynamic content here */}
          </div>
        </Content>

      </Layout>
    </Layout>
  );
};

export default MainDashboard;
