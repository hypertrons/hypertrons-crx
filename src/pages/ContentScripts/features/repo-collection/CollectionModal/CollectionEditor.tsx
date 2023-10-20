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
  onCreate: (values: Values, newRepoData: string[] | undefined) => void;
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

async function getUserOrOrgRepos(
  username: string,
  isOrg: boolean,
  accessToken: string // GitHub Personal Access Token
): Promise<RepositoryInfo[]> {
  try {
    const apiUrl = isOrg
      ? `https://api.github.com/orgs/${username}/repos`
      : `https://api.github.com/users/${username}/repos`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API request failed with status: ${response.status}`
      );
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
const accessToken =
  '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';

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<DataSourceType[]>();
  const [newRepoData, setNewRepoData] = useState<string[]>();
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
      description: repoData.description || '', // 如果没有描述信息，则设为空字符串
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
    collectionName: isEdit ? collectionName : '', // 设置字段的初始值
  };
  const modalTitle = isEdit
    ? 'CollectionDisplayModal Editor'
    : 'Creat a new collection';

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: DataType[]
  ) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    console.log('selected Rows', selectedRows);
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
    // 在点击 "inquire" 按钮时，获取 Quick import 输入框的值
    const inputValue = form.getFieldValue('Quick import');
    async function fetchRepositories() {
      try {
        const result = await getUserOrOrgRepos(inputValue, isOrg, accessToken);
        // 在这里可以访问 "repositories"，它将包含获取的仓库信息
        console.log('Repositories:', result);
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
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input placeholder={'input name here'} />
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
