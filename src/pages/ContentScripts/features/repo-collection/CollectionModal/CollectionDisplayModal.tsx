import { useRepoCollectionContext } from '../context';

import React, { useEffect, useRef, useState } from 'react';
import { Col, List, Modal, Row } from 'antd';

export const CollectionDisplayModal = (): JSX.Element => {
  const [listData, setListData] = useState<string[]>();

  const {
    allRelations,
    selectedCollection,
    showDisplayModal,
    setHideCollectionList,
    setShowDisplayModal,
  } = useRepoCollectionContext();

  useEffect(() => {
    setListData(
      allRelations
        .filter((relation) => relation.collectionId === selectedCollection)
        .map((relation) => relation.repositoryId)
    );
  }, [showDisplayModal]);

  const handleCancel = () => {
    setShowDisplayModal(false);
    setHideCollectionList(false);
  };
  return (
    <>
      <Modal
        width={'95%'}
        bodyStyle={{ height: '70vh' }}
        centered
        open={showDisplayModal}
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
            {selectedCollection}
          </div>
        }
        onCancel={handleCancel}
        footer={[
          <button className={'btn'} onClick={handleCancel}>
            Cancel
          </button>,
        ]}
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
          <Col xs={{ span: 11, offset: 1 }} lg={{ span: 12, offset: 2 }}>
            {/* Graph */}
            Graph is here
          </Col>
        </Row>
      </Modal>
    </>
  );
};
