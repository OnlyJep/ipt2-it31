import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./../dashboard/Header";
import MainDashboard from "./../dashboard/MainDashboard";
import SideBar from "./../dashboard/SideBar";

export default function Routers() {
    return (
        <Router>
            <Routes>
                {/* Default route redirects to MainDashboard */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                
                {/* Define routes for each component */}
                <Route path="/dashboard" element={<MainDashboard />} />
                <Route path="/header" element={<Header />} />
                <Route path="/sidebar" element={<SideBar />} />
            </Routes>
        </Router>
    );
}

if (document.getElementById('root')) {
    ReactDOM.render(<Routers />, document.getElementById('root'));
}
