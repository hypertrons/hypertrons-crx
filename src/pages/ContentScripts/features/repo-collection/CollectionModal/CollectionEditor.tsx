import { useRepoCollectionContext } from '../context';

import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Table,
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
  addType: string
): Promise<RepositoryInfo[]> {
  try {
    const currentAccessToken = accessTokens[currentTokenIndex];
    let apiUrl = '';
    if (addType === 'User') {
      apiUrl = `https://api.github.com/users/${username}/repos`;
    } else if (addType === 'Organization') {
      apiUrl = `https://api.github.com/orgs/${username}/repos`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        currentTokenIndex = (currentTokenIndex + 1) % accessTokens.length; // switch to next token
        return getUserOrOrgRepos(username, addType);
      } else {
        throw new Error(
          `GitHub API request failed with status: ${response.status}`
        );
      }
    }

    const reposData = await response.json();

    return reposData.map((repo: any) => ({
      name: repo.name,
      description: repo.description || '',
    }));
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
  const [addType, setAddType] = useState<string>('FullName');

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

  const handleSearchClick = () => {
    const inputValue = form.getFieldValue('Quick import');
    if (addType === 'FullName') {
      fetchRepositoryDescription(inputValue)
        .then((repoDescription) => {
          const key = dataSource ? dataSource.length + 1 : 1;
          repoDescription.key = key.toString();
          console.log('Repository Description:', repoDescription);
          if (dataSource) {
            setDataSource([...dataSource, repoDescription]);
          } else {
            setDataSource([repoDescription]);
          }
        })
        .catch((error) => {
          console.error('Error fetching repository description:', error);
        });
    } else {
      fetchRepositories();
    }

    async function fetchRepositories() {
      try {
        const result = await getUserOrOrgRepos(inputValue, addType);
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
  };

  function handleImportClick() {
    console.log('newRepoData', newRepoData);
  }

  return (
    <Modal
      width={1200}
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
                const editedCollectionName = isEdit ? collectionName : null;
                if (value === editedCollectionName) {
                  return Promise.resolve();
                }
                if (allCollections.some((item) => item.name === value)) {
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
          <Input type="textarea" placeholder={addType} />
        </Form.Item>
        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
        >
          <Radio.Group
            defaultValue="FullName"
            buttonStyle="solid"
            onChange={(e) => {
              const selectedValue = e.target.value;
              setAddType(selectedValue);
            }}
          >
            <Radio.Button value="FullName">FullName</Radio.Button>
            <Radio.Button value="User">User</Radio.Button>
            <Radio.Button value="Organization">Organization</Radio.Button>
          </Radio.Group>
          <Button onClick={handleSearchClick}>search</Button>
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
