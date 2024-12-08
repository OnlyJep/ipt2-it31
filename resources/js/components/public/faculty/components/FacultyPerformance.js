import React from 'react';
import { Card, List, Typography } from 'antd';

const { Title } = Typography;

const FacultyPerformance = ({ performanceData }) => {
    return (
        <Card title="Faculty Performance" bordered={false}>
            <List
                dataSource={performanceData}
                renderItem={item => (
                    <List.Item>
                        <Typography.Text strong>{item.name}</Typography.Text>
                        <div style={{ marginLeft: 'auto' }}>
                            <Typography.Text>{item.feedback}</Typography.Text>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default FacultyPerformance;
