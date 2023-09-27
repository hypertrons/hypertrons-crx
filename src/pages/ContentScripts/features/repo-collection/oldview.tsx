import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Space, Divider, Button, Input, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  DownOutlined,
  AppstoreOutlined,
  GithubOutlined,
  SettingOutlined,
  DeleteOutlined,
  FolderAddOutlined,
} from '@ant-design/icons';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import { getRepoName } from '../../../../helpers/get-repo-info';
import Collection from './Collection';

const iconMap: any = {
  AppstoreOutlined: AppstoreOutlined,
  GithubOutlined: GithubOutlined,
  SettingOutlined: SettingOutlined,
  DeleteOutlined: DeleteOutlined,
  FolderAddOutlined: FolderAddOutlined,
};

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
  const [options, setOptions] = useState<HypercrxOptions>(defaults);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  const { token } = useToken();
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };
  const DefaultItems = [
    getItem('X-Lab', 'collection1', <GithubOutlined />, [
      getItem('delete collection', 'delete1', <DeleteOutlined />),
      getItem('add current Repo', 'add1', <FolderAddOutlined />),
      { type: 'divider' },
      getItem('open-digger', '1.1'),
      getItem('open-perf', '1.2'),
      getItem('open-leaderboard', '1.3'),
      getItem('open-wonderland', '1.4'),
    ]),
    getItem('Hypertrons', 'collection2', <AppstoreOutlined />, [
      getItem('delete collection', 'delete2', <DeleteOutlined />),
      getItem('add current Repo', 'add2', <FolderAddOutlined />),
      { type: 'divider' },
      getItem('hypertrons-crx', '2.1'),
      getItem('hypertrons-crx-website', '2.2'),
    ]),
    getItem('Collection Three', 'collection3', <SettingOutlined />, [
      getItem('delete collection', 'delete3', <DeleteOutlined />),
      getItem('add current Repo', 'add3', <FolderAddOutlined />),
      { type: 'divider' },
      getItem('Option 9', '3.1'),
      getItem('Option 10', '3.2'),
      getItem('Option 11', '3.3'),
      getItem('Option 12', '3.4'),
    ]),
  ];
  const [items, setitems] = useState(DefaultItems);
  const [refresh, setRefresh] = useState(0);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [open, setOpen] = useState(false);
  const collectionRef = useRef<() => void>(null);
  const [collectionData, setCollectionData] = useState([]);

  //将 Repo Collection 信息转化为 `JSON` 用于存至 Chrome 本地
  const StorageCollection = (Storage: any) => {
    console.log('S', Storage);
    const jsonArray = Storage.map((item: any) => {
      const childrenArray = item.children
        ? item.children.map((child: any) => {
            if (child.type === 'divider') {
              return { type: 'divider' };
            }
            return {
              label: child.label,
              key: child.key,
              icon: child.icon && child.icon.type.render.displayName,
            };
          })
        : undefined;

      return {
        label: item.label,
        key: item.key,
        icon: item.icon && item.icon.type.render.displayName,
        children: childrenArray,
      };
    });

    console.log('jsonarry', jsonArray);

    chrome.storage.sync.set({ UserCollection: jsonArray }).then(() => {
      setCollectionData(jsonArray);
      console.log('codata', collectionData);
      console.log('UserCollection is set');
    });
  };

  //每次对 Repo Collection 列表更新后，执行 UpdateCollection 更新 Key值
  const UpdateCollection = (updatedItems: any) => {
    const renumberedItems = updatedItems.map((collection: any, index: any) => {
      return {
        ...collection,
        key: `collection${index + 1}`,
        children: collection.children.map((child: any) => {
          if (/^delete/.test(child.key)) {
            return {
              ...child,
              key: `delete${index + 1}`,
            };
          } else if (/^add/.test(child.key)) {
            return {
              ...child,
              key: `add${index + 1}`,
            };
          } else if (child.type === 'divider') {
            return { ...child };
          } else {
            const childIndex = parseInt(child.key.split('.')[1]);
            return {
              ...child,
              key: `${index + 1}.${childIndex}`,
            };
          }
        }),
      };
    });

    console.log(renumberedItems);

    setitems(renumberedItems);

    // 更新本地存储
    StorageCollection(renumberedItems);
  };

  // 将 JSON 转化为 Item 初始化的数据结构
  const ConvertJSONToItem = (jsonArray: any) => {
    return jsonArray.map((item: any) => {
      const children = item.children.map((child: any) => {
        if (child.type === 'divider') {
          return { type: 'divider' };
        }

        const childIconComponent = child.icon
          ? React.createElement(iconMap[child.icon])
          : undefined;

        return getItem(child.label, child.key, childIconComponent);
      });

      const iconComponent = item.icon
        ? React.createElement(iconMap[item.icon])
        : undefined;

      return getItem(item.label, item.key, iconComponent, children);
    });
  };

  // 读取用户自定义的 Repo Collection
  useEffect(() => {
    chrome.storage.sync.get(['UserCollection']).then((result) => {
      if (result.UserCollection) {
        setCollectionData(result.UserCollection);
        const CollectionArray: any = ConvertJSONToItem(result.UserCollection);
        setitems(CollectionArray);
      }
    });
  }, [refresh]);

  const AddRepoCollection = () => {
    if (newCollectionName.trim() === '') {
      alert('请输入集合名称');
      return;
    }

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
        getItem(
          'add current Repo',
          `add${newCollectionNumber}`,
          <FolderAddOutlined />
        ),
        { type: 'divider' },
      ]
    );

    // 更新 items 数组
    setitems([...items, newMenuItem]);

    // 更新本地存储，需要转化为JSON格式
    StorageCollection([...items, newMenuItem]);

    // ToDo AHooks
    // ToDo 数据结构改良
  };

  const SetAsDefault = () => {
    setitems(DefaultItems);
    StorageCollection(DefaultItems);
  };

  const handleMenuClick: MenuProps['onClick'] = (info) => {
    const clickedItemKey: any = info.keyPath;
    console.log('here', info);
    // Check if the clicked item is the "delete collection" label
    if (/^delete/.test(clickedItemKey[0])) {
      const updatedItems: any = items.filter(
        (item: any) => item.key !== clickedItemKey[1]
      );

      // 重新分配集合的键值
      UpdateCollection(updatedItems);
    }

    // Check if the clicked item is the "add current Repo" label
    if (/^add/.test(clickedItemKey[0])) {
      const RepoFullName = getRepoName();
      const RepoName = RepoFullName.match(/\/([^/]+)$/);

      // ToDo 改大写开头

      if (RepoName) {
        const CollectionNumber = clickedItemKey[1].match(/\d+/)[0];
        const targetCollection: any = items.find(
          (item: any) => item.key === clickedItemKey[1]
        );

        if (
          targetCollection.children.some(
            (item: any) => item.label === RepoName[1]
          )
        ) {
          alert('该仓库已存在~');
          return;
        }
        const pattern = new RegExp(`^${CollectionNumber}\.(\\d+)`);
        const matchingNumbers = targetCollection.children
          .filter((item: any) => pattern.test(item.key))
          .map((item: any) => parseInt(item.key.match(pattern)[1]));
        const maxNumber = Math.max(...matchingNumbers);

        // 创建新的 Repo 编号
        const newRepoKey = maxNumber + 1;

        const newRepoLabel = RepoName[1];

        // 创建新的 Repo项
        const newRepoItem = getItem(
          newRepoLabel,
          `${CollectionNumber}.${newRepoKey}`
        );
        targetCollection.children.push(newRepoItem);
      }

      // 更新 items 数组
      setitems(items);

      UpdateCollection(items);

      setRefresh(refresh + 1);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const OpenCollection = () => {
    if (collectionRef.current) {
      setOpen(false);
      setTimeout(function () {
        if (collectionRef.current) {
          // @ts-ignore
          collectionRef.current.showModal();
        }
      }, 200);
    }
  };

  return (
    <div className="RepoCollection">
      <Dropdown
        open={open}
        onOpenChange={handleOpenChange}
        arrow={true}
        placement={'bottom'}
        trigger={['click']}
        menu={{
          items,
          onClick: handleMenuClick,
          subMenuOpenDelay: 0.2,
          subMenuCloseDelay: 0.2,
        }}
        dropdownRender={(menu) => (
          <div style={contentStyle}>
            <header className="SelectMenu-header">
              <span className="SelectMenu-title">合集列表 </span>
              <button
                className="SelectMenu-closeButton"
                type="button"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <svg
                  aria-label="Close menu"
                  role="img"
                  height="16"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="16"
                  data-view-component="true"
                  className="octicon octicon-x"
                >
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
                </svg>
              </button>
            </header>
            {React.cloneElement(menu as React.ReactElement, {
              style: menuStyle,
            })}
            <footer className="SelectMenu-footer">
              <div className="text-right">
                <Space style={{ padding: 8 }}>
                  <Input
                    style={{ width: '180px' }}
                    placeholder="输入添加合集名称"
                    allowClear
                    size="middle"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                  />
                  <button
                    className="btn-primary btn"
                    onClick={AddRepoCollection}
                  >
                    {' '}
                    添加
                  </button>{' '}
                  <button className="btn" onClick={OpenCollection}>
                    {' '}
                    展板
                  </button>{' '}
                  <button className="btn" onClick={SetAsDefault}>
                    {' '}
                    重置
                  </button>{' '}
                </Space>
              </div>
            </footer>
          </div>
        )}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Button>
              Repo Collection
              <DownOutlined />
            </Button>
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default View;
