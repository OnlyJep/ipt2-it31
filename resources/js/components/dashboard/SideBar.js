// src/components/SideBar/SideBar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import SideBarLogo from './SideBarLogo';
import SideBarTexture from './SideBarTexture';

const SideBar = () => {
  return (
    <SideBarTexture>
      {/* Sidebar logo */}
      <SideBarLogo />

      {/* Line separator */}
      <div className="separator"></div>

      {/* Navigation links */}
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/users" className="nav-link">
            Users
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/student-is" className="nav-link">
            Student IS
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/faculty-is" className="nav-link">
            Faculty IS
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/class-scheduling" className="nav-link">
            Class Scheduling
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/academic-programs" className="nav-link">
            Academic Programs
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/subject-enlistment" className="nav-link">
            Subject Enlistment
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/enlistment-manager" className="nav-link">
            Enlistment Manager
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/classroom-manager" className="nav-link">
            Classroom Manager
          </NavLink>
        </li>
      </ul>

      {/* Line separator above the System Settings */}
      <div className="separator"></div>

      {/* System Settings */}
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/system-settings" className="nav-link">
            System Settings
          </NavLink>
        </li>
      </ul>
    </SideBarTexture>
  );
};

export default SideBar;
