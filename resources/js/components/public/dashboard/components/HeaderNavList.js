import React from 'react';
import { Menu } from 'antd';
import { logout } from './../../../assets/logoff'; // Import the logout function
const HeadNavList = ({ userRole, navigate, logout }) => {
  // Dynamically set the "Manage Account" link based on user role
  const manageAccountLink = userRole === 'superadmin' ? '/superadmin/manage-account' : '/admin/manage-account';

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <a href={manageAccountLink}>Manage Account</a>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => logout(navigate)}>Logout</Menu.Item> {/* Pass navigate to logout */}
    </Menu>
  );

  return menu;
};

export default HeadNavList;
