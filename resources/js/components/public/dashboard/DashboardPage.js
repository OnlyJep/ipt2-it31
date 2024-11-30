import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard

const { Content } = Layout; // Destructure Content from Layout


const DashboardPageDashboard = () => {
    return (
        <Content>
            <h1>This is a Dashboard Page</h1>
        </Content>
    );
};
const DashboardPage = () => {
    return (
        <MainDashboard>
            <DashboardPageDashboard />
        </MainDashboard>
    );
};

export default DashboardPage;