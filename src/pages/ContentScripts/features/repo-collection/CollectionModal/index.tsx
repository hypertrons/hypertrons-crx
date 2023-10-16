import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../../options-storage';
import { useRepoCollectionContext } from '../context';
import CollectionEditor from './CollectionEditor';

import React, { useState, useEffect, useRef, useContext } from 'react';
import { Modal, Tabs, List, Col, Row, Button } from 'antd';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export type CollectionDataType = {
  name: string;
  repos: string[];
  key: string;
};

export type CollectionTabType = {
  label: string;
  children: string;
  key: string;
};

const initialItems = [
  { label: 'Tab 1', children: 'Content of Tab 1', key: '1' },
  { label: 'Tab 2', children: 'Content of Tab 2', key: '2' },
  { label: 'Tab 3', children: 'Content of Tab 3', key: '3' },
];

const defaultCollection: CollectionDataType[] = [
  {
    name: 'X-lab',
    repos: [
      'X-lab2017/open-digger',
      'X-lab2017/open-leaderboard',
      'X-lab2017/open-wonderland',
    ],
    key: '1',
  },
  {
    name: 'Hypertrons',
    repos: ['hypertrons/hypertrons-crx', 'X-lab2017/open-leaderboard'],
    key: '2',
  },
];

interface Props {}

export const CollectionModal = ({}: Props): JSX.Element | null => {
  const { showModal, setShowModal, selectedCollection, setSelectedCollection } =
    useRepoCollectionContext();

  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState<CollectionTabType[]>(initialItems);
  const newTabIndex = useRef(0);
  const [collectionData, setCollectionData] =
    useState<CollectionDataType[]>(defaultCollection);
  const [listData, setListData] = useState<string[] | undefined>(
    defaultCollection[0].repos
  );
  const [isClick, setIsClick] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>();

  const editTab = (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button
        onClick={() => {
          setIsClick(true);
          setIsEdit(false);
          setShowModal(true);
        }}
      >
        Add New Collection
      </Button>
      <Button
        onClick={() => {
          setIsClick(true);
          setIsEdit(true);
          setShowModal(true);
        }}
        disabled={items.length === 0}
      >
        Edit Collection
      </Button>
    </div>
  );

  useEffect(() => {
    chrome.storage.sync.get(['userCollectionData']).then((result) => {
      if (result.userCollectionData) {
        console.log('loading in modal', result.userCollectionData);
        setCollectionData(result.userCollectionData);
      }
      console.log('collectionData in modal', collectionData);
    });
    const transformedData = collectionData.map((item, index) => ({
      label: item.name,
      children: `Content of Collection ${item.name},it has repository ${item.repos}`,
      key: (index + 1).toString(),
    }));
    const temp = collectionData.find(
      (item) => item.name === selectedCollection
    )?.key;
    if (temp) {
      setActiveKey(temp);
    }
    console.log('temp value', temp);
    setListData(collectionData[temp ? parseInt(temp) - 1 : 0].repos);
    console.log('list Data', listData);
    console.log(transformedData);
    setItems(transformedData);
  }, [showModal]);

  const onCreate = (values: any, newRepoData: string[] | undefined) => {
    setListData(newRepoData);
    if (isEdit) {
      const updatedItems = items.map((item) => {
        if (item.key === activeKey.toString()) {
          return { ...item, label: values.collectionName };
        }
        return item;
      });
      setItems(updatedItems);
    } else {
      const newActiveKey = (items.length + 1).toString();
      const newPanes = [...items];
      newPanes.push({
        label: values.collectionName,
        children: `Content of ${values.collectionName}`,
        key: newActiveKey,
      });
      setItems(newPanes);
      setActiveKey(newActiveKey);
    }
    console.log('Received values of form: ', values);
    setShowModal(false);
    setIsClick(false);
    setIsEdit(undefined);
  };
  const onChange = (newActiveKey: string) => {
    console.log('active key', newActiveKey);

    const foundItem = collectionData.find((item) => item.key === newActiveKey);
    console.log('foundItem', foundItem);
    if (foundItem) {
      setListData(foundItem.repos);
    }

    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: 'New Tab',
      children: 'Content of new Tab',
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this collection？',
      okText: 'Confirm',
      onOk() {
        // 用户点击确认按钮时执行的操作
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
          if (item.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
          if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key;
          } else {
            newActiveKey = newPanes[0].key;
          }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
      },
      onCancel() {},
    });
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <div>
      <Modal
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            Repo Collection Dashboard
          </div>
        }
        open={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
        footer={null}
        width={'95%'}
        bodyStyle={{ height: '70vh' }}
      >
        <Row>
          <Col xs={{ span: 5, offset: 1 }} lg={{ span: 4 }}>
            <div style={{ marginTop: '50px' }}>
              <List
                header={
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    Repositories
                  </div>
                }
                bordered
                dataSource={listData}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </div>
          </Col>
          <Col xs={{ span: 11, offset: 1 }} lg={{ span: 18 }}>
            <Tabs
              hideAdd
              type="editable-card"
              onChange={onChange}
              activeKey={activeKey}
              onEdit={onEdit}
              items={items}
              tabBarExtraContent={editTab}
            />
          </Col>
        </Row>
      </Modal>
      {isClick && (
        <CollectionEditor
          open={showModal}
          onCreate={onCreate}
          onCancel={() => {
            //setShowModal(false);
            setIsClick(false);
            setIsEdit(undefined);
          }}
          isEdit={isEdit}
          collectionName={items[parseInt(activeKey) - 1].label}
          collectionData={collectionData[parseInt(activeKey) - 1].repos}
        />
      )}
    </div>
  );
};
