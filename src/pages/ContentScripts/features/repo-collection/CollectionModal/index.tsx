import { useRepoCollectionContext } from '../context';
import CollectionEditor from './CollectionEditor';
import CollectionContent from '../CollectionContent';

import React, { useState, useEffect } from 'react';
import { Modal, Tabs, List, Col, Row, Button } from 'antd';

const { TabPane } = Tabs;

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

type CollectionTabType = {
  label: string;
  children: React.ReactNode;
  key: string;
};

export const CollectionManageModal = () => {
  const {
    showCollectionModal,
    setShowCollectionModal,
    selectedCollection,
    setSelectedCollection,
    updaters,
    allCollections,
    allRelations,
  } = useRepoCollectionContext();

  const [activeKey, setActiveKey] = useState<string>();
  const [items, setItems] = useState<CollectionTabType[]>([]);
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);

  const editTab = (
    <div style={{ display: 'flex', gap: '10px', marginRight: '15px' }}>
      <Button
        onClick={() => {
          setIsInEditMode(false);
          setShowCollectionModal(true);
        }}
      >
        Add New Collection
      </Button>
      <Button
        onClick={() => {
          setIsInEditMode(true);
          setShowCollectionModal(true);
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

    setActiveKey(selectedCollection);
    setItems(initialItems);
  }, [showCollectionModal]);

  const onCreate = async (values: any, newRepoData: string[]) => {
    if (isInEditMode) {
      const updatedItems = items.map((item) => {
        if (item.key === activeKey?.toString()) {
          return {
            label: values.collectionName,
            children: <CollectionContent repoNames={newRepoData} />,
            key: values.collectionName,
          };
        }
        return item;
      });
      setItems(updatedItems);
    } else {
      const newPanes = [...items];
      newPanes.push({
        label: values.collectionName,
        children: <CollectionContent repoNames={newRepoData} />,
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

    setSelectedCollection(values.collectionName);
    setIsInEditMode(false);
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
        open={showCollectionModal}
        onCancel={() => {
          setShowCollectionModal(false);
          setSelectedCollection(undefined);
        }}
        footer={null}
        width={'95%'}
        style={{
          top: '10px',
          bottom: '10px',
          height: '95vh',
        }}
        bodyStyle={{ height: 'calc(95vh - 30px)' }} // 40px is the sum of top and bottom padding
      >
        <Tabs
          hideAdd
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          onEdit={onEdit}
          items={items}
          tabBarExtraContent={editTab}
          style={{ height: '100%', margin: '0px 24px' }}
        />
      </Modal>
      <CollectionEditor
        open={isInEditMode}
        onCreate={onCreate}
        onCancel={() => {
          setIsInEditMode(false);
        }}
        isEdit={isInEditMode}
        collectionName={selectedCollection ? selectedCollection : ''}
        collectionData={
          isInEditMode
            ? allRelations
                .filter(
                  (relation) => relation.collectionId === selectedCollection
                )
                .map((relation) => relation.repositoryId)
            : ['']
        }
      />
    </div>
  );
};
