import { useRepoCollectionContext } from '../context';
import CollectionEditor from './CollectionEditor';

import React, { useState, useEffect } from 'react';
import { Modal, Tabs, List, Col, Row, Button } from 'antd';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

type CollectionTabType = {
  label: string;
  children: string;
  key: string;
};

export const CollectionManageModal = () => {
  const {
    showManageModal,
    setShowManageModal,
    selectedCollection,
    setSelectedCollection,
    updaters,
    allCollections,
    allRelations,
  } = useRepoCollectionContext();

  const [activeKey, setActiveKey] = useState<string>();
  const [items, setItems] = useState<CollectionTabType[]>([]);
  const [listData, setListData] = useState<string[] | undefined>(
    allRelations
      .filter((relation) => relation.collectionId === allCollections[0].id)
      .map((relation) => relation.repositoryId)
  );
  const [isClick, setIsClick] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>();

  const editTab = (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button
        onClick={() => {
          setIsClick(true);
          setIsEdit(false);
          setShowManageModal(true);
        }}
      >
        Add New Collection
      </Button>
      <Button
        onClick={() => {
          setIsClick(true);
          setIsEdit(true);
          setShowManageModal(true);
        }}
        disabled={items.length === 0 || selectedCollection === undefined}
      >
        Edit Collection
      </Button>
    </div>
  );

  useEffect(() => {
    const initialItems = allCollections.map((collection, index) => ({
      label: collection.name,
      children: `Content of ${collection.name}`,
      key: collection.id,
    }));
    const initialListData = allRelations
      .filter((relation) =>
        relation.collectionId === selectedCollection
          ? selectedCollection
          : allCollections[0].name
      )
      .map((relation) => relation.repositoryId);
    setActiveKey(selectedCollection);
    setItems(initialItems);
    setListData(initialListData);
  }, [showManageModal]);

  useEffect(() => {}, []);

  const onCreate = (values: any, newRepoData: string[] | undefined) => {
    /*
     * remove collection and its relations
     */
    if (selectedCollection) {
      updaters.removeCollection(selectedCollection);
      updaters.removeRelations(
        allRelations.filter(
          (relation) => relation.collectionId === selectedCollection
        )
      );
    }

    /*
     * add newCollection and its relations
     */
    setSelectedCollection(values.collectionName);
    if (newRepoData) {
      updaters.addCollection(values.collectionName);
      updaters.addRelations(
        newRepoData.map((repo) => ({
          collectionId: values.collectionName,
          repositoryId: repo,
        }))
      );
    }

    setListData(newRepoData);
    if (isEdit) {
      const updatedItems = items.map((item) => {
        if (item.key === activeKey?.toString()) {
          return { ...item, label: values.collectionName };
        }
        return item;
      });
      setItems(updatedItems);
    } else {
      const newPanes = [...items];
      newPanes.push({
        label: values.collectionName,
        children: `Content of ${values.collectionName}`,
        key: values.collectionName,
      });
      setItems(newPanes);
      setActiveKey(values.collectionName);
    }
    console.log('Received values of form: ', values);

    setIsClick(false);
    setIsEdit(undefined);
  };

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    setSelectedCollection(newActiveKey);
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
        updaters.removeCollection(targetKey.toString());
        updaters.removeRelations(
          allRelations.filter(
            (relation) => relation.collectionId === targetKey.toString()
          )
        );
      },
      onCancel() {},
    });
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'remove') remove(targetKey);
  };

  return (
    <div>
      <Modal
        open={showManageModal}
        onCancel={() => {
          setShowManageModal(false);
          setSelectedCollection(undefined);
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
                    {selectedCollection
                      ? selectedCollection
                      : 'Select tab first'}
                  </div>
                }
                bordered
                dataSource={allRelations
                  .filter(
                    (relation) => relation.collectionId === selectedCollection
                  )
                  .map((relation) => relation.repositoryId)}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </div>
          </Col>
          <Col xs={{ span: 10, offset: 1 }} lg={{ span: 17 }}>
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
          open={showManageModal}
          onCreate={onCreate}
          onCancel={() => {
            setIsClick(false);
            setIsEdit(undefined);
          }}
          isEdit={isEdit}
          collectionName={selectedCollection ? selectedCollection : ''}
          collectionData={allRelations
            .filter((relation) => relation.collectionId === selectedCollection)
            .map((relation) => relation.repositoryId)}
        />
      )}
    </div>
  );
};
