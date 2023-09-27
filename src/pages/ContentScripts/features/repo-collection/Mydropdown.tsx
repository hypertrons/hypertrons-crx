import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Space, Button, Input, theme, Checkbox } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import { getRepoName } from '../../../../helpers/get-repo-info';
import Collection from './Collection';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const { useToken } = theme;

const Mydropdown = () => {
  const { token } = useToken();
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  const [open, setOpen] = useState(false);

  const listFooter = (
    <div className="text-right">
      <Space>
        <button className="btn" onClick={() => setOpen(false)}>
          {' '}
          返回
        </button>{' '}
        <button className="btn-primary btn" onClick={editRepo}>
          {' '}
          编辑
        </button>{' '}
      </Space>
    </div>
  );
  const defaultCollection = {
    Xlab2017: [
      'X-lab2017/open-digger',
      'X-lab2017/open-leaderboard',
      'X-lab2017/open-wonderland',
    ],
    Hypertrons: ['hypertrons/hypertrons-crx', 'X-lab2017/open-leaderboard'],
  };

  const repoName = getRepoName();
  const [options, setOptions] = useState<HypercrxOptions>(defaults);

  const [footerContent, setFooterContent] = useState(listFooter);
  const [items, setItems] = useState([
    {
      key: '1',
      label: <div>Xlab2017</div>,
    },
    {
      key: '2',
      label: <div>Hypertrons</div>,
    },
  ]);
  const [collectionData, setCollectionData] = useState(defaultCollection);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalValue, setModalValue] = useState(['', ['']]);

  const editFooter = (
    <div className="text-right">
      <Space style={{ padding: 8 }}>
        <button className="btn" onClick={backToList}>
          {' '}
          返回
        </button>{' '}
        <Input
          style={{ width: '180px' }}
          placeholder="输入添加合集名称"
          size="middle"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
        />
        <button className="btn-primary btn" onClick={addNewCollection}>
          {' '}
          添加
        </button>{' '}
        <button className="btn-primary btn" onClick={applyChange}>
          {' '}
          应用
        </button>{' '}
      </Space>
    </div>
  );

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(['userCollectionData']).then((result) => {
      if (result.userCollectionData) {
        console.log('hi,loading', result.userCollectionData);
      }
      setCollectionData(result.userCollectionData);
      console.log('collectionData', collectionData);
      const temp = getListData();
      console.log('listData', temp);
      setItems(temp);
    });
  }, [refresh]);

  function handleValueClick(value: string) {
    const temp = collectionData[value as keyof typeof collectionData];
    setModalValue([value, temp]);
    // open modal
    setModalVisible(true);
    setOpen(false);
  }

  const closeModal = () => {
    // close modal
    setModalVisible(false);
    setOpen(true);
  };

  const getListData = () => {
    type DataType = {
      [key: string]: string[];
    };
    console.log('hello collection', collectionData);
    const originalData: DataType = collectionData;
    const transformedData: DataType = {};

    // 遍历原始数据对象
    for (const key in originalData) {
      const values = originalData[key];

      values.forEach((value) => {
        if (!transformedData[value]) {
          transformedData[value] = [];
        }
        transformedData[value].push(key);
      });
    }

    console.log('trans', transformedData);

    const labels: { key: string; label: JSX.Element }[] = [];

    if (transformedData[repoName]) {
      transformedData[repoName].forEach((value, index) => {
        labels.push({
          key: (index + 1).toString(),
          label: <div onClick={() => handleValueClick(value)}>{value}</div>,
        });
      });
    }

    return labels;
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  function addNewCollection() {
    if (newCollectionName.trim() === '') {
      alert('请输入集合名称');
      return;
    }
    /*
    const temp={...collectionData,newCollectionName:[""]};
    console.log('newCN',temp);
    setCollectionData(temp);
    setItems(updateCollectionList);
    chrome.storage.sync.set({ collectionData: collectionData }).then(() => {
      console.log('UserCollection is set');
    });
 */
  }
  function backToList() {
    // items变化
    const temp = getListData();
    setItems(temp);
    // footer变化
    setFooterContent(listFooter);
  }

  function applyChange() {
    // items变化
    const temp = getListData();
    setItems(temp);
    // footer变化
    setFooterContent(listFooter);
  }
  const handleCheckboxChange = (e: CheckboxChangeEvent, key: string) => {
    const newData = { ...collectionData }; // 创建数据的副本
    console.log('newData', newData);
    console.log('e', e);
    if (e.target.checked) {
      newData[key as keyof typeof newData].push(repoName);
      console.log('add', newData);
    } else {
      newData[key as keyof typeof newData] = newData[
        key as keyof typeof newData
      ].filter((item) => item !== repoName);
      console.log('remove', newData);
    }

    setCollectionData({
      ...newData,
      [key]: newData[key as keyof typeof newData],
    });
    // 更新状态
    chrome.storage.sync.set({ userCollectionData: newData }).then(() => {
      console.log('Data is setting collectionData', collectionData);
    });
  };
  function updateCollectionList() {
    const labels: { key: string; label: JSX.Element }[] = [];
    for (const key in collectionData) {
      if (collectionData.hasOwnProperty(key)) {
        const isChecked =
          collectionData[key as keyof typeof collectionData].includes(repoName);
        labels.push({
          key: (labels.length + 1).toString(),
          label: (
            <div>
              <Checkbox
                defaultChecked={isChecked}
                onChange={(e) => handleCheckboxChange(e, key)}
              >
                {key}
              </Checkbox>
            </div>
          ),
        });
      }
    }
    return labels;
  }

  function editRepo() {
    //items变化
    setItems(updateCollectionList);
    // footer变化
    setFooterContent(editFooter);
  }

  return (
    <div className="RepoCollection">
      <Dropdown
        menu={{ items }}
        open={open}
        onOpenChange={handleOpenChange}
        // 将item和footer修改

        arrow={true}
        placement={'bottom'}
        trigger={['click']}
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
            <footer className="SelectMenu-footer">{footerContent}</footer>
          </div>
        )}
      >
        <Space>
          <Button>
            Repo Collection
            <DownOutlined />
          </Button>
        </Space>
      </Dropdown>
      {isModalVisible && (
        <Collection data={modalValue} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Mydropdown;
