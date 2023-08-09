import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Divider, Button, Input, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  AppstoreOutlined,
  GithubOutlined,
  SettingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { useToken } = theme;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  disabled?: Boolean
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    disabled,
    type,
  } as MenuItem;
}

const View = () => {
  const { token } = useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  const [items, setitems] = useState([
    getItem('X-Lab', 'collection1', <GithubOutlined />, [
      getItem('delete collection', 'delete1', <DeleteOutlined />),
      { type: 'divider' },
      getItem('open-digger', '1'),
      getItem('open-perf', '2'),
      getItem('open-leaderboard', '3'),
      getItem('open-wonderland', '4'),
    ]),
    getItem('Collection Two', 'collection2', <AppstoreOutlined />, [
      getItem('delete collection', 'delete2', <DeleteOutlined />),
      { type: 'divider' },
      getItem('Option 5', '5'),
      getItem('Option 6', '6'),
    ]),
    getItem('Collection Three', 'collection3', <SettingOutlined />, [
      getItem('delete collection', 'delete3', <DeleteOutlined />),
      { type: 'divider' },
      getItem('Option 9', '9'),
      getItem('Option 10', '10'),
      getItem('Option 11', '11'),
      getItem('Option 12', '12'),
    ]),
  ]);

  const [newCollectionName, setNewCollectionName] = useState('');

  const AddRepoCollection = () => {
    if (newCollectionName.trim() === '') {
      alert('请输入集合名称');
      return;
    }
    alert(newCollectionName);
    // 找到所有 collection 编号的最大值
    const collectionNumbers = items.map((item: any) => {
      const match = item.key.match(/collection(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxCollectionNumber = Math.max(...collectionNumbers);

    // 创建新的 collection 编号
    const newCollectionNumber = maxCollectionNumber + 1;
    const newCollectionKey = `collection${newCollectionNumber}`;

    // 创建新的菜单项
    const newMenuItem = getItem(
      newCollectionName,
      newCollectionKey,
      <GithubOutlined />,
      [
        getItem(
          'delete collection',
          `delete${newCollectionNumber}`,
          <DeleteOutlined />
        ),
        { type: 'divider' },
      ]
    );

    // 更新 items 数组
    setitems([...items, newMenuItem]);
  };

  const DeleteRepoCollection = (info: any) => {
    const clickedItemKey = info.keyPath;
    // Check if the clicked item is the "delete collection" label
    if (/^delete/.test(clickedItemKey[0])) {
      const updatedItems = items.filter(
        (item: any) => item.key !== clickedItemKey[1]
      );
      setitems(updatedItems);

      // 重新分配集合的键值
      const renumberedItems = updatedItems.map((item: any, index) => {
        const match = item.key.match(/collection(\d+)/);
        const newCollectionNumber = index + 1;
        return {
          ...item,
          key: match ? `collection${newCollectionNumber}` : item.key,
        };
      });

      setitems(renumberedItems);
    }
  };

  return (
    <div className="RepoCollection">
      <Dropdown
        arrow={true}
        placement={'bottom'}
        trigger={['click']}
        menu={{ items, onClick: DeleteRepoCollection }}
        dropdownRender={(menu) => (
          <div style={contentStyle}>
            <Space style={{ padding: 8 }}>
              <Input
                placeholder="输入添加合集名称"
                allowClear
                size="middle"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <Button onClick={AddRepoCollection}>添加</Button>
            </Space>
            <Divider style={{ margin: 0 }} />
            {React.cloneElement(menu as React.ReactElement, {
              style: menuStyle,
            })}
          </div>
        )}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Button>
              Repo Colleciton
              <DownOutlined />
            </Button>
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default View;
