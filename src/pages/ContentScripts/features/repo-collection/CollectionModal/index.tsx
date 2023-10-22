import { useRepoCollectionContext } from '../context';
import CollectionEditor from './CollectionEditor';
import CollectionContent from '../CollectionContent';

import React, { useState, useEffect } from 'react';
import { Modal, Tabs, List, Col, Row, Button } from 'antd';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

type CollectionTabType = {
  label: string;
  children: React.ReactNode;
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
  const [listData, setListData] = useState<string[]>(
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
    const initialItems = allCollections.map((collection) => {
      const repoList = allRelations
        .filter((relation) => relation.collectionId === collection.name)
        .map((relation) => relation.repositoryId);
      return {
        label: collection.name,
        children: <CollectionContent repoNames={repoList} />,
        key: collection.id,
      };
    });
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

  const onCreate = async (values: any, newRepoData: string[]) => {
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
        children: <CollectionContent repoNames={listData} />,
        key: values.collectionName,
      });
      setItems(newPanes);
      setActiveKey(values.collectionName);
    }

    try {
      /*
       * remove collection and its relations
       */
      if (selectedCollection) {
        await updaters.removeCollection(selectedCollection);
        const relationsToRemove = allRelations.filter(
          (relation) => relation.collectionId === selectedCollection
        );
        await updaters.removeRelations(relationsToRemove);
      }

      /*
       * add newCollection and its relations
       */

      await updaters.addCollection({
        id: values.collectionName,
        name: values.collectionName,
      });
      if (newRepoData) {
        const relationsToAdd = newRepoData.map((repo) => ({
          collectionId: values.collectionName,
          repositoryId: repo,
        }));
        await updaters.addRelations(relationsToAdd);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    console.log('Received values of form: ', values);

    setListData(newRepoData);
    setSelectedCollection(values.collectionName);
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
      async onOk() {
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
        await updaters.removeCollection(targetKey.toString());
        await updaters.removeRelations(
          allRelations.filter(
            (relation) => relation.collectionId === targetKey.toString()
          )
        );
        setSelectedCollection(newActiveKey);
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
        width={'100%'}
        style={{
          top: '0px',
          bottom: '0px',
          height: '100vh',
          maxWidth: 'unset',
        }}
        bodyStyle={{ height: 'calc(100vh - 40px)', overflow: 'auto' }} // 40px is the sum of top and bottom padding
      >
        <Tabs
          hideAdd
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          onEdit={onEdit}
          items={items}
          tabBarExtraContent={editTab}
        />
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
