import React from "react";
import ReactDOM from "react-dom/client"; // Note the change here
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./../public/dashboard/components/Header";
import MainDashboard from "./../public/dashboard/components/MainDashboard";
import SideBar from "./../public/dashboard/components/SideBar";
import UserLogin from "./../public/loginportal/components/UserLogin"; // Import UserLogin component

export default function Routers() {
    return (
        <Router>
            <Routes>
                {/* Default route redirects to MainDashboard */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Define routes for each component */}
                <Route path="/dashboard" element={<MainDashboard />} />
                <Route path="/header" element={<Header />} />
                <Route path="/sidebar" element={<SideBar />} />
                <Route path="/login" element={<UserLogin />} /> {/* Route for UserLogin */}
            </Routes>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Routers />);