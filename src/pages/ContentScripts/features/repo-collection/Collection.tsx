import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'antd';

interface CollectionProps {
  data: any;
  showRef: React.RefObject<() => void>;
}

// ToDo forwardRef

const Collection = (props: CollectionProps): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  // 使用 ref 将 showModal 函数暴露出去
  // @ts-ignore
  React.useImperativeHandle(props.showRef, (): { showModal: () => void } => ({
    showModal,
  }));

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
        width={1000}
        centered
        open={open}
        title="Repo Collection"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default Collection;
