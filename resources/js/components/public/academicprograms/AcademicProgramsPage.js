import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  

const { Content } = Layout; 


const AcademicProgramsPageDashboard = () => {
    return (
        <Content>
            <h1>This is a AcademicProgram</h1>
        </Content>
    );
};
const AcademicProgramsPage = () => {
    return (
        <MainDashboard>
            <AcademicProgramsPageDashboard />
        </MainDashboard>
    );
};

export default AcademicProgramsPage;