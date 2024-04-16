import React, { ReactNode } from 'react';
import { Card } from 'antd';
import './ChartCard.css'; // 导入自定义样式

interface ChartCardProps {
  title: ReactNode;
  children: React.ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card
      className="custom-card"
      title={title}
      bordered={false}
      bodyStyle={{ padding: 0 }}
    >
      {children}
    </Card>
  );
}

export default ChartCard;
