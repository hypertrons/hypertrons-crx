import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OverviewChart from '../components/overview-chart';
import { Layout, theme } from 'antd';
const { Header, Content } = Layout;

const BasicLayout = ({ repo }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedData = queryParams.get('data');
    if (encodedData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(encodedData));
        setAnalysisData(decodedData);
        // 控制台打印数据
        console.log('从URL参数获取的分析数据:', decodedData);
      } catch (error) {
        console.error('解析URL参数中的数据失败:', error);
      }
    } else {
      console.log('URL中没有找到分析数据');
    }
  }, [location.search]);

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: '100%',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
          }}
        >
          {repo}深度分析报告
        </div>
      </Header>
      <Layout style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '20px 0',
            padding: '10px 0',
            color: '#000000',
          }}
        >
          概览
        </div>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <OverviewChart repo={repo} analysisData={analysisData} />
        </Content>
        {/* <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: "20px 0",
            padding: "10px 0",
            color: "#000000",
          }}
        >
          项目深度洞察
        </div>
        <Content>
          <OverviewChart repo={repo} analysisData={analysisData} />
        </Content> */}
      </Layout>
    </Layout>
  );
};
export default BasicLayout;
