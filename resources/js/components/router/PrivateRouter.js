
import React from 'react';
import { Navigate } from 'react-router-dom';

// Function to check if user is authenticated (based on localStorage token)
const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token'); // Check if the token exists
};

// Function to get user role from localStorage
const getUserRole = () => {
  return localStorage.getItem('user_role'); // Assuming role is saved as 'user_role'
};

const PrivateRoute = ({ children, roleRequired }) => {
  const isLoggedIn = isAuthenticated();  
  const userRole = getUserRole(); 

  // If the user is not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // If the user doesn't have the required role, redirect to their dashboard
  if (roleRequired && !roleRequired.includes(userRole)) {
    return <Navigate to={`/${userRole}/dashboard`} />;
  }

  // If the user is authenticated and has the correct role, render the child components
  return children;
};


export default PrivateRoute;
