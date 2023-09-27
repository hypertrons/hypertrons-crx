import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, List, Modal, Row, Tabs } from 'antd';

interface CollectionProps {
  data: any;
  closeModal: () => void;
}

// ToDo forwardRef

const Collection = (props: CollectionProps): JSX.Element => {
  const collectionData = props.data;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const listData = collectionData[1];

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        width={1200}
        centered
        open={open}
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
            '{collectionData[0]}' Collection Dashboard
          </div>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <button className={'btn'} onClick={handleCancel}>
            返回
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
            Graph is here
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Collection;
