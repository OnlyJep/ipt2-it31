import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard

const { Content } = Layout; // Destructure Content from Layout


const SubjectEnlistmentPageDashboard = () => {
    return (
        <Content>
            <h1>This is a SubjectEnlistment</h1>
        </Content>
    );
};
const SubjectEnlistmentPage = () => {
    return (
        <MainDashboard>
            <SubjectEnlistmentPageDashboard />
        </MainDashboard>
    );
};

export default SubjectEnlistmentPage;