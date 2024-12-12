import React from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios

const Logoff = () => {
    const navigate = useNavigate();

    // Function to show the logout confirmation modal
    const showLogoutConfirm = () => {
        Modal.confirm({
            title: "Are you sure you want to log out?",
            content: "You will be logged out of your account.",
            onOk: handleLogout,
            onCancel: () => console.log("Logout cancelled"),
            okText: "Yes",
            cancelText: "No",
        });
    };

    // Logout function that calls the backend, removes items from localStorage, and redirects
    const handleLogout = async () => {
        localStorage.clear();
        window.location.reload(); // Optionally reload the page
    };

    // Return the function to trigger logout (used by HeadNavList or wherever you invoke it)
    return {
        showLogoutConfirm,
    };
};

export default Logoff;
