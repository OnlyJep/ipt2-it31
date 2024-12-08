import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';

const HeadNavList = ({ userRole, navigate, logout }) => {
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (userRole) {
      setRole(userRole); 
      setLoading(false); 
    } else {
      
      const savedRole = localStorage.getItem('user_role') || 'guest'; 
      setRole(savedRole);
      setLoading(false);
    }
  }, [userRole]); 

  
  if (loading) {
    return <div>Loading...</div>; 
  }

  
  const manageAccountLink = `/${role}/manage-account`;

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <NavLink to={manageAccountLink} className="nav-link">
          Manage Account
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => logout(navigate)}>Logout</Menu.Item> {}
    </Menu>
  );

  return menu;
};

export default HeadNavList;
