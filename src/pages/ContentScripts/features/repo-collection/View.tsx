import React, { useState, useEffect, useRef } from 'react';

import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import {
  Modal,
  Tabs,
  List,
  Col,
  Row,
  Button,
  Form,
  Input,
  Table,
  Divider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface Values {
  name: string;
  quickImport: string;
}

interface DataType {
  key: React.Key;
  name: string;
  description: string;
}

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  isEdit: boolean | undefined;
  collectionName: string;
}

const initialItems = [
  { label: 'Tab 1', children: 'Content of Tab 1', key: '1' },
  { label: 'Tab 2', children: 'Content of Tab 2', key: '2' },
  { label: 'Tab 3', children: 'Content of Tab 3', key: '3' },
];

const defaultCollection = {
  Xlab2017: [
    'X-lab2017/open-digger',
    'X-lab2017/open-leaderboard',
    'X-lab2017/open-wonderland',
  ],
  Hypertrons: ['hypertrons/hypertrons-crx', 'X-lab2017/open-leaderboard'],
};

interface Props {}

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

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
  isEdit,
  collectionName,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([1, 2]);
  const [form] = Form.useForm();

  const initialValues = {
    collectionName: isEdit ? collectionName : '', // 设置字段的初始值
  };
  const modalTitle = isEdit ? 'Collection Editor' : 'Creat a new collection';

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
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
            dataSource={dataSource}
            columns={columns}
          />
        </Col>
      </Row>
    </Modal>
  );
};

const View = ({}: Props): JSX.Element | null => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);
  const [collectionData, setCollectionData] = useState(defaultCollection);
  const [listData, setListData] = useState(defaultCollection.Xlab2017);
  const [isClick, setIsClick] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>();

  const editTab = (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button
        onClick={() => {
          setIsClick(true);
          setIsEdit(false);
          setOpen(true);
        }}
      >
        Add New Collection
      </Button>
      <Button
        onClick={() => {
          setIsClick(true);
          setIsEdit(true);
          setOpen(true);
        }}
      >
        Edit Collection
      </Button>
    </div>
  );

  useEffect(() => {
    chrome.storage.sync.get(['userCollectionData']).then((result) => {
      if (result.userCollectionData) {
        console.log('loading in modal', result.userCollectionData);
      }
      setCollectionData(result.userCollectionData);
      console.log('collectionData in modal', collectionData);
      const transformedData = Object.keys(result.userCollectionData).map(
        (key, index) => ({
          label: key,
          children: `Content of Collection ${key}`,
          key: (index + 1).toString(),
        })
      );

      const firstKey = Object.keys(result.userCollectionData)[0];
      setListData(result.userCollectionData[firstKey]);

      console.log('list Data', listData);
      console.log(transformedData);
      setItems(transformedData);
    });
  }, []);

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    setOpen(false);
    setIsClick(false);
  };
  const onChange = (newActiveKey: string) => {
    console.log('active key', newActiveKey);

    const foundItem = items.find((item) => item.key === newActiveKey);

    if (foundItem) {
      const labelToFind = foundItem.label;
      const newListData =
        collectionData[labelToFind as keyof typeof collectionData];
      console.log('newlistdata', newListData);
      setListData(newListData);
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
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  // receive message from popup
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.greeting === 'demo') {
      showModal();
      focus(); // change the focus to the browser content
    }
  });

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
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        width={1200}
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
        <CollectionCreateForm
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false);
            setIsClick(false);
          }}
          isEdit={isEdit}
          collectionName={items[parseInt(activeKey) - 1].label}
        />
      )}
    </div>
  );
};

export default View;
