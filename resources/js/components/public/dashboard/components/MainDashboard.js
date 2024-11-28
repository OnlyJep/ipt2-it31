import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";

const MainDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Reusable Sidebar */}
      <SideBar />
      
      <div className="dashboard-main">
        {/* Reusable Header */}
        <Header />

        {/* Main content for Dashboard */}
        <div className="dashboard-content">
          <h1>Main Dashboard Content</h1>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
