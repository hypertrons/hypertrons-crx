import React from 'react';
import { Row, Col } from 'antd';
import LineChart from '../../../Options/variable-charts/LineChart';
import BarChart from '../../../Options/variable-charts/BarChart';
import SankeyChart from '../../../Options/variable-charts/SankeyChart';
import PieChart from '../../../Options/variable-charts/PieChart';
import StackedBarChart from '../../../Options/variable-charts/StackedBarChart';
import CodeStackedBarChart from '../../../Options/variable-charts/CodeStackedBarChart';
import BoxplotChart from '../../../Options/variable-charts/BoxplotChart';
import ChartCard from './ChartCard';
import NumericPanel from '../../../Options/variable-charts/NumericPanel';

interface CollectionDashboardProps {
  repoNames: string[];
  currentRepo?: string;
}

const CollectionDashboard: React.FC<CollectionDashboardProps> = ({
  repoNames,
  currentRepo,
}) => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <ChartCard title="Total Star Count">
            <NumericPanel
              repoNames={repoNames}
              height={200}
              theme={'light'}
              currentRepo={currentRepo}
            />
          </ChartCard>
        </Col>
        <Col span={8}>
          <ChartCard title="Paticipant Pie Chart">
            <PieChart
              repoNames={repoNames}
              height={200}
              theme={'light'}
              currentRepo={currentRepo}
            />
          </ChartCard>
        </Col>
        <Col span={8}>
          <ChartCard title="Issue Response Time Box Plot">
            <BoxplotChart
              repoNames={repoNames}
              height={200}
              theme={'light'}
              // currentRepo={currentRepo}
            />
          </ChartCard>
        </Col>
      </Row>

      <div style={{ margin: '16px 0' }}></div>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <ChartCard title="Star Count Over Time">
                <LineChart
                  repoNames={repoNames}
                  height={200}
                  theme={'light'}
                  currentRepo={currentRepo}
                />
              </ChartCard>
            </Col>
            <Col span={12}>
              <ChartCard title="Star Count Bar Chart">
                <BarChart
                  repoNames={repoNames}
                  height={200}
                  theme={'light'}
                  currentRepo={currentRepo}
                />
              </ChartCard>
            </Col>

            <Col span={12}>
              <ChartCard title="Star Count Over Time">
                <StackedBarChart
                  repoNames={repoNames}
                  height={200}
                  theme={'light'}
                  currentRepo={currentRepo}
                />
              </ChartCard>
            </Col>
            <Col span={12}>
              <ChartCard title="Star Count Over Time">
                <LineChart
                  repoNames={repoNames}
                  height={200}
                  theme={'light'}
                  currentRepo={currentRepo}
                />
              </ChartCard>
            </Col>

            <Col span={24}>
              <ChartCard title="Code Line Additions/Deletions Bar Chart">
                <CodeStackedBarChart
                  repoNames={repoNames}
                  height={200}
                  theme={'light'}
                  // currentRepo={currentRepo}
                />
              </ChartCard>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <ChartCard title="User Activity Sankey Chart">
                <SankeyChart
                  repoNames={repoNames}
                  height={744}
                  theme={'light'}
                  currentRepo={currentRepo}
                />
              </ChartCard>
            </Col>
          </Row>
        </Col>
      </Row>

      <div style={{ margin: '16px 0' }}></div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <ChartCard title="Star Count Over Time">
            <StackedBarChart
              repoNames={repoNames}
              height={200}
              theme={'light'}
              currentRepo={currentRepo}
            />
          </ChartCard>
        </Col>
        <Col span={8}>
          <ChartCard title="Star Count Over Time">
            <LineChart
              repoNames={repoNames}
              height={200}
              theme={'light'}
              currentRepo={currentRepo}
            />
          </ChartCard>
        </Col>
        <Col span={8}>
          <ChartCard title="Star Count Bar Chart">
            <BarChart
              repoNames={repoNames}
              height={200}
              theme={'light'}
              currentRepo={currentRepo}
            />
          </ChartCard>
        </Col>
      </Row>
    </div>
  );
};

export default CollectionDashboard;
