import React from 'react';
import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  ScheduleOutlined,
  ApartmentOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const SideBarNavList = ({ userRole }) => {
  // Use the location hook to get the current URL path
  const location = useLocation();

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]} // Set the selected key to the current path
      style={{ height: '100%', borderRight: 0, background: 'transparent' }}
    >
      {/* Dashboard Menu Item */}
      <Menu.Item key={`/${userRole}/dashboard`} icon={<DashboardOutlined />} className="nav-item">
        <NavLink to={`/${userRole}/dashboard`} className="nav-link">
          Dashboard
        </NavLink>
      </Menu.Item>

      {/* Admin and Superadmin have access to Users and Faculty IS */}
      {(userRole === 'admin' || userRole === 'superadmin') && (
        <>
          <Menu.Item key={`/${userRole}/users`} icon={<UserOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/users`} className="nav-link">
              Users
            </NavLink>
          </Menu.Item>
          <Menu.Item key={`/${userRole}/faculty-is`} icon={<TeamOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/faculty-is`} className="nav-link">
              Faculty IS
            </NavLink>
          </Menu.Item>
        </>
      )}

      {/* Admin and Superadmin shared menu items */}
      {(userRole === 'admin' || userRole === 'superadmin') && (
        <>
          <Menu.Item key={`/${userRole}/student-is`} icon={<BookOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/student-is`} className="nav-link">
              Student IS
            </NavLink>
          </Menu.Item>
          <Menu.Item key={`/${userRole}/class-scheduling`} icon={<ScheduleOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/class-scheduling`} className="nav-link">
              Class Scheduling
            </NavLink>
          </Menu.Item>
        </>
      )}

      {/* Menu items available for all users */}
      <Menu.Item key={`/${userRole}/academic-programs`} icon={<ApartmentOutlined />} className="nav-item">
        <NavLink to={`/${userRole}/academic-programs`} className="nav-link">
          Academic Programs
        </NavLink>
      </Menu.Item>

      <Menu.Item key={`/${userRole}/subject-enlistment`} icon={<ProfileOutlined />} className="nav-item">
        <NavLink to={`/${userRole}/subject-enlistment`} className="nav-link">
          Subject Enlistment
        </NavLink>
      </Menu.Item>

      <Menu.Item key={`/${userRole}/enlistment-manager`} icon={<ProfileOutlined />} className="nav-item">
        <NavLink to={`/${userRole}/enlistment-manager`} className="nav-link">
          Enlistment Manager
        </NavLink>
      </Menu.Item>

      <Menu.Item key={`/${userRole}/classroom-manager`} icon={<ProfileOutlined />} className="nav-item">
        <NavLink to={`/${userRole}/classroom-manager`} className="nav-link">
          Classroom Manager
        </NavLink>
      </Menu.Item>

      {/* Separator between main items and system settings */}
      <div className="separator" />

      {/* System Settings Menu Item (only visible for superadmin) */}
      {userRole === 'superadmin' && (
        <Menu.Item key="/system-settings" icon={<SettingOutlined />} className="nav-item">
          <NavLink to="/system-settings" className="nav-link">
            System Settings
          </NavLink>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default SideBarNavList;
