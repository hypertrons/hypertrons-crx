import React from 'react';
import { Form, Input, Button, Switch, Tabs, Card } from 'antd';
import { GithubOutlined, GitlabOutlined } from '@ant-design/icons';

// https://github.com/ant-design/ant-design/issues/13620
// Jest would throw error when using this way
// const { TabPane } = Tabs;

function onWelcomeMsgChange() {}

function onDashboardChange() {}

const onFinish = () => {};

const tailLayout = {
  wrapperCol: { offset: 2, span: 14 },
};

const content = (platform: string, isActive: boolean) => (
  <div>
    {isActive ? (
      <div>
        <p>
          Great！You have connected to{' '}
          <span style={{ color: 'deepskyblue', fontWeight: 'bold' }}>{platform}</span>! Now you can
          add or update your personal access token below：
        </p>
        <div style={{ marginTop: '20px' }}>
          <Form
            layout="horizontal"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item label="Token" name="token">
              <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    ) : (
      <div>
        <p>
          Ohhhh, unable to connect to your{' '}
          <span style={{ color: 'deepskyblue', fontWeight: 'bold' }}>{platform}</span> account.{' '}
        </p>
        <a href="/">Please click here to authorize.</a>
      </div>
    )}
  </div>
);

function Popup() {
  return (
    <div>
      <Card title="Basic configuration">
        <Form
          // {...layout}
          layout="horizontal"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item label="Welcome Message">
            <Switch
              checkedChildren="on"
              unCheckedChildren="off"
              defaultChecked
              onChange={onWelcomeMsgChange}
            />
          </Form.Item>
          <Form.Item label="Showing Dashboard">
            <Switch
              checkedChildren="on"
              unCheckedChildren="off"
              defaultChecked
              onChange={onDashboardChange}
            />
          </Form.Item>
        </Form>
      </Card>
      <Card title="Identity Authentication and Management">
        <Tabs defaultActiveKey="github">
          <Tabs.TabPane
            tab={
              <span>
                <GithubOutlined style={{ fontSize: '20px' }} />
                <span style={{ fontSize: '18px' }}>GitHub</span>
              </span>
            }
            key="github"
          >
            {content('GitHub', true)}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <GitlabOutlined style={{ fontSize: '20px' }} />{' '}
                <span style={{ fontSize: '18px' }}>GitLab</span>{' '}
              </span>
            }
            key="gitlab"
          >
            {content('GitLab', false)}
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default Popup;
