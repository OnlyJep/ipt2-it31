import React from 'react';
import { Tabs } from 'antd';
import MainDashboard from '../../dashboard/components/MainDashboard';
import BuildingPage from './components/building/BuildingPage';
import RoomTagsPage from './components/roomtags/RoomTagsPage';
import FloorPage from './components/floor/FloorPage';

const { TabPane } = Tabs;

const FacilitiesManagerManagementPage = () => {
  return (
    <MainDashboard>
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        <h1>Facilities Manager Management</h1>
        
        {}
        <div style={{
          borderBottom: '2px solid #1890ff', 
          width: '10%', 
          marginBottom: '20px'
        }} />

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Building" key="1">
            <BuildingPage />
          </TabPane>
          <TabPane tab="Floor" key="2">
            <FloorPage /> {}
          </TabPane>
          <TabPane tab="Room Tags" key="3">
            <RoomTagsPage />
          </TabPane>
        </Tabs>
      </div>
    </MainDashboard>
  );
};

export default FacilitiesManagerManagementPage;
