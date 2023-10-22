// Index.tsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme } from 'antd';

import CollectionDashboard from './CollectionDashboard';

const { Content, Sider } = Layout;
interface Index {
  repoNames: string[];

  currentRepo?: string;
}

const LIGHT_THEME = {
  BG_COLOR: '#ffffff',
};

const CollectionContent: React.FC<Index> = ({ repoNames, currentRepo }) => {
  const menuItems = repoNames.map((repo, index) => ({
    key: index,
    label: repo,
  }));
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 添加一个状态来跟踪选中的仓库名
  const [selectedRepo, setSelectedRepo] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    setSelectedRepo(currentRepo);
  }, [currentRepo]);
  const handleMenuClick = (key: string) => {
    setSelectedRepo(key);
  };

  return (
    <Layout style={{ padding: '24px 0', background: colorBgContainer }}>
      <Sider style={{ background: colorBgContainer }} width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={currentRepo !== undefined ? [currentRepo] : []}
          style={{ height: '100%' }}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)} //点击切换选中的repo
        />
      </Sider>
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        <CollectionDashboard repoNames={repoNames} currentRepo={selectedRepo} />
      </Content>
    </Layout>
  );
};

export default CollectionContent;
