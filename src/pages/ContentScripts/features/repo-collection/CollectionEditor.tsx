import React, { useState } from 'react';

import { Modal, Col, Row, Button, Form, Input, Table, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Values {
  name: string;
  quickImport: string;
}

interface DataType {
  key: React.Key;
  name: string;
  description: string;
}

interface CollectionEditorProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  isEdit: boolean | undefined;
  collectionName: string;
}

const dataSource = [
  {
    key: '1',
    name: 'hypertrons/hypertrons-crx',
    description:
      'A browser extension to get more insights into projects and developers on GitHub.',
  },
  {
    key: '2',
    name: 'X-lab2017/open-leaderboard',
    description: 'OpenLeaderboard',
  },
];

const columns: ColumnsType<DataType> = [
  {
    title: 'name',
    dataIndex: 'name',
  },
  {
    title: 'description',
    dataIndex: 'description',
  },
];

const CollectionEditor: React.FC<CollectionEditorProps> = ({
  open,
  onCreate,
  onCancel,
  isEdit,
  collectionName,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const initialValues = {
    collectionName: isEdit ? collectionName : '', // 设置字段的初始值
  };
  const modalTitle = isEdit ? 'Collection Editor' : 'Creat a new collection';

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const defaultSelectedRowKeys: React.Key[] = ['1', '2'];
  const rowSelection = {
    defaultSelectedRowKeys,
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <Modal
      width={900}
      open={open}
      title={modalTitle}
      okText="Confirm"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="inline"
        name="form_in_modal"
        initialValues={initialValues}
      >
        <Form.Item
          name="collectionName"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input placeholder={'input name here'} />
        </Form.Item>
        <Form.Item name="Quick import" label="Quick import">
          <Input type="textarea" placeholder={'user/organization'} />
        </Form.Item>
        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
        >
          <Button>inquire</Button>
          <Button>import</Button>
        </div>
      </Form>
      <Divider />
      <Row>
        <Col span={24}>
          <Table
            rowSelection={rowSelection}
            dataSource={isEdit ? dataSource : []}
            columns={columns}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default CollectionEditor;
