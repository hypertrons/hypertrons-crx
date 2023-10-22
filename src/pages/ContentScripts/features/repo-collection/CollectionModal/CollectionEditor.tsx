import { useRepoCollectionContext } from '../context';

import React, { useEffect, useState } from 'react';
import {
  Modal,
  Col,
  Row,
  Button,
  Form,
  Input,
  Table,
  Divider,
  Radio,
} from 'antd';
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

interface RepositoryInfo {
  name: string;
  description: string;
}

interface CollectionEditorProps {
  open: boolean;
  onCreate: (values: Values, newRepoData: string[]) => void;
  onCancel: () => void;
  isEdit: boolean | undefined;
  collectionName: string;
  collectionData: string[];
}

interface DataSourceType {
  key: string;
  name: string;
  description: string;
}

const accessTokens = ['token'];

let currentTokenIndex = 0;

async function getUserOrOrgRepos(
  username: string,
  isOrg: boolean
): Promise<RepositoryInfo[]> {
  try {
    const currentAccessToken = accessTokens[currentTokenIndex];

    const apiUrl = isOrg
      ? `https://api.github.com/orgs/${username}/repos`
      : `https://api.github.com/users/${username}/repos`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        currentTokenIndex = (currentTokenIndex + 1) % accessTokens.length; // switch to next token
        return getUserOrOrgRepos(username, isOrg);
      } else {
        throw new Error(
          `GitHub API request failed with status: ${response.status}`
        );
      }
    }

    const reposData = await response.json();

    const repositories: RepositoryInfo[] = reposData.map((repo: any) => ({
      name: repo.name,
      description: repo.description || '',
    }));

    return repositories;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

// TODO 需要找到一个合适的方法解决Token的问题...

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
  collectionData,
}) => {
  const { allCollections } = useRepoCollectionContext();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<DataSourceType[]>();
  const [newRepoData, setNewRepoData] = useState<string[]>(collectionData);
  const [isOrg, setIsOrg] = useState<boolean>(false);

  async function fetchRepositoryDescription(repositoryName: string) {
    const apiUrl = `https://api.github.com/repos/${repositoryName}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(
        `GitHub API request failed for ${repositoryName} with status: ${response.status}`
      );
    }
    const repoData = await response.json();
    return {
      key: collectionData.indexOf(repositoryName).toString(),
      name: repositoryName,
      description: repoData.description || '',
    };
  }

  useEffect(() => {
    Promise.all(
      collectionData.map((repositoryName) =>
        fetchRepositoryDescription(repositoryName)
      )
    )
      .then((repositoryDescriptions) => {
        setDataSource(repositoryDescriptions);
      })
      .catch((error) => {
        console.error('Error fetching repository descriptions:', error);
      });
  }, []);

  const initialValues = {
    collectionName: isEdit ? collectionName : '',
  };
  const modalTitle = isEdit ? 'Collection Editor' : 'Create a new collection';

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: DataType[]
  ) => {
    setNewRepoData(selectedRows.map((item) => item.name));
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const defaultSelectedRowKeys: React.Key[] = Array.from(
    { length: collectionData.length },
    (_, index) => index.toString()
  );
  const rowSelection = {
    defaultSelectedRowKeys,
    onChange: onSelectChange,
  };

  const handleInquireClick = () => {
    const inputValue = form.getFieldValue('Quick import');
    async function fetchRepositories() {
      try {
        const result = await getUserOrOrgRepos(inputValue, isOrg);
        let nextKey: number;
        if (dataSource) {
          nextKey = dataSource.length + 1;
        } else {
          nextKey = 1;
        }
        const addKeyValue = [
          ...result.map((repo) => ({
            key: (nextKey++).toString(),
            name: repo.name,
            description: repo.description,
          })),
        ];
        if (dataSource) {
          setDataSource([...dataSource, ...addKeyValue]);
        } else {
          setDataSource(addKeyValue);
        }
      } catch (error) {
        // 处理错误
        console.error('Error:', error);
      }
    }

    fetchRepositories();
  };

  function handleImportClick() {
    console.log('newRepoData', newRepoData);
  }

  return (
    <Modal
      width={1000}
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
            onCreate(values, newRepoData);
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
              message: 'Please input the name of collection!',
            },
            {
              validator: (rule, value) => {
                const existingNames = allCollections;
                if (existingNames.some((item) => item.name === value)) {
                  return Promise.reject('Collection name already exists.');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Input name here" />
        </Form.Item>

        <Form.Item name="Quick import" label="Quick import">
          <Input
            type="textarea"
            placeholder={isOrg ? 'organization' : 'user'}
          />
        </Form.Item>
        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
        >
          <Radio.Group
            defaultValue="User"
            buttonStyle="solid"
            onChange={(e) => {
              const selectedValue = e.target.value;
              setIsOrg(selectedValue === 'Organization');
            }}
          >
            <Radio.Button value="User">User</Radio.Button>
            <Radio.Button value="Organization">Organization</Radio.Button>
          </Radio.Group>
          <Button onClick={handleInquireClick}>inquire</Button>
          <Button onClick={handleImportClick}>import</Button>
        </div>
      </Form>
      <Divider />
      <Row>
        <Col span={24}>
          <Table
            dataSource={isEdit ? dataSource : []}
            columns={columns}
            rowKey="key"
            rowSelection={rowSelection}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default CollectionEditor;
