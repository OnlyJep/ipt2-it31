import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Unauthorized from './Unauthorized';

const PrivateRoute = ({ children, roleRequired }) => {
  const { role } = useParams();
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role'));

  useEffect(() => {
    // Update authToken and userRole whenever they change in localStorage
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    setAuthToken(token);
    setUserRole(role);
  }, []); // This effect runs once when the component is mounted

  // If either the auth_token or user_role is missing, redirect to the login page
  if (!authToken || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has the correct role
  const isRoleValid = Array.isArray(roleRequired)
    ? roleRequired.includes(userRole)
    : userRole === roleRequired;

  // Validate if the URL role matches the logged-in user role
  if (role && role !== userRole) {
    return <Unauthorized />; // If roles do not match, show Unauthorized
  }

  if (!isRoleValid) {
    return <Unauthorized />; // If role is invalid, show Unauthorized
  }

  // If authenticated and role is valid, render children (protected route content)
  return children;
};

export default PrivateRoute;
