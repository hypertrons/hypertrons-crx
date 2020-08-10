import React from 'react';
import { Form, Input, Button, Switch } from 'antd';

function onChange() {}

const onFinish = () => {};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 14 },
};

function Popup() {
  return (
    <div>
      <Form
        {...layout}
        layout="horizontal"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item label="Notification">
          <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked onChange={onChange} />
        </Form.Item>
        <Form.Item label="Github Token" name="githubToken">
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Popup;
