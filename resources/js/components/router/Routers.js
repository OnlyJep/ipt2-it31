import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './../public/dashboard/components/Header';
import SideBar from './../public/dashboard/components/SideBar';
import UserLogin from '../public/loginportal/UserLoginPage';
import PrivateRoute from './PrivateRouter';

import Dashboard from '../public/dashboard/DashboardPage';
import Profile from '../public/profile/ProfilePage';
import User from '../public/user/UserPage';
import FacultyIS from '../public/faculty/FacultyISPage';
import StudentIS from '../public/student/StudentISPage';
import ClassSchedulings from '../public/classscheduling/ClassSchedulingPage';
import AcademicPrograms from '../public/academicprograms/AcademicProgramsPage';
import SubjectEnlistments from '../public/subjectenlistment/SubjectEnlistmentPage';
import EnlistmentManagers from '../public/enlistmentmanager/EnlistmentManagerPage';
import ClassroomManagers from '../public/classroommanager/ClassroomManagerPage';


const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token'); // Check if token exists
};

export default function Routers() {
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role')); // Get user role from localStorage if it exists

  useEffect(() => {
    // Ensure that the role is correctly updated in localStorage and state after login
    const role = localStorage.getItem('user_role');
    if (role) {
      setUserRole(role);
    }
  }, []);

  const isLoggedIn = isAuthenticated();

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to={`/${userRole}/dashboard`} /> : <Navigate to="/login" />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={`/${userRole}/dashboard`} /> : <UserLogin setUserRole={setUserRole} />} />
        <Route path="/superadmin/dashboard" element={<PrivateRoute roleRequired="superadmin"><Dashboard /></PrivateRoute>} />
        <Route path="/admin/dashboard" element={<PrivateRoute roleRequired="admin"><Dashboard /></PrivateRoute>} />
        <Route path="/:role/users" element={<PrivateRoute roleRequired={['admin', 'superadmin']}><User /></PrivateRoute>} />
        <Route path="/:role/manage-account" element={<PrivateRoute roleRequired={['admin', 'superadmin']}><Profile /></PrivateRoute>} />
        <Route path="/:role/faculty-is" element={<PrivateRoute roleRequired={['admin', 'superadmin']}><FacultyIS /></PrivateRoute>} />
        <Route path="/:role/student-is" element={<PrivateRoute roleRequired={['admin', 'superadmin']}><StudentIS /></PrivateRoute>} />
        <Route path="/:role/class-scheduling" element={<PrivateRoute roleRequired={['admin', 'superadmin']}><ClassSchedulings /></PrivateRoute>} />
        <Route path="/:role/academic-programs" element={<PrivateRoute roleRequired={['admin', 'superadmin']}><AcademicPrograms /></PrivateRoute>} />
        <Route path="/:role/subject-enlistment" element={<PrivateRoute roleRequired={['admin', 'superadmin']}><SubjectEnlistments /></PrivateRoute>} />
        <Route path="/:role/enlistment-manager" element={<PrivateRoute roleRequired={['admin', 'superadmin']}><EnlistmentManagers /></PrivateRoute>} />
        <Route path="/:role/classroom-manager" element={<PrivateRoute roleRequired={['admin', 'superadmin']}><ClassroomManagers /></PrivateRoute>} />
        <Route path="/header" element={<Header />} />
        <Route path="/sidebar" element={<SideBar />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Routers />);

