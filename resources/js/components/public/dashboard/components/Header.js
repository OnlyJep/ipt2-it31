import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Dropdown, Avatar, Badge } from "antd";
import { BellFilled, UserOutlined, DownOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { logout } from './../../../assets/logoff'; // Import the logout function
import HeadNavList from './HeaderNavList'; // Import the new HeadNavList component
import MobileSidebarToggle from './MobileSidebarToggle';  // Import the mobile sidebar toggle component

const { Header: AntHeader } = Layout;

const Header = ({ style }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/user/profile')
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the user profile!", error);
      });

    axios.get('/api/notifications/count')
      .then(response => {
        setNotifications(response.data.count);
      })
      .catch(error => {
        console.error("There was an error fetching the notifications count!", error);
      });
  }, []);

  return (
    <AntHeader className="header" style={style}>
      <div className="header-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Left side of the header */}
        <div className="header-left" style={{ flexGrow: 1 }}></div>

        {/* Hamburger Button for Mobile */}
        <div className="menu-icon" onClick={() => setDrawerVisible(true)}>
          <MenuOutlined style={{ fontSize: '24px', color: '#3f7afc' }} />
        </div>

        {/* Right side of the header */}
        <div className="header-right" style={{ display: "flex", alignItems: "center", paddingRight: '20px' }}>
          {/* Notification Icon with Badge */}
          <Badge count={notifications} offset={[10, 0]}>
            <BellFilled style={{ fontSize: '22px', marginRight: '20px', cursor: 'pointer', color: '#1890ff' }} />
          </Badge>

          {/* User Profile Avatar with Dropdown */}
          <Dropdown overlay={<HeadNavList userRole={user?.role} navigate={navigate} logout={logout} />} placement="bottomRight">
            <div style={{ display: "flex", alignItems: "center", cursor: 'pointer' }}>
              <Avatar
                size="large"
                icon={user?.avatar ? <img src={user.avatar} alt="Profile" /> : <UserOutlined />}
                style={{ marginRight: '8px' }}
              />
              <DownOutlined style={{ fontSize: '16px', color: '#3f7afc' }} />
            </div>
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
