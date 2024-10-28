import { message } from 'antd';
const messageStyle = {
  fontSize: '16px',
  padding: '20px 24px',
  width: '600px',
  margin: '0 auto',
};
export const handleMessage = (status: string, content: string, key: string) => {
  if (status === 'loading') {
    message.loading({ content, key, style: messageStyle });
    return;
  }
  if (status === 'success') {
    message.success({ content, key, duration: 3, style: messageStyle });
  } else if (status === 'error') {
    message.error({ content, key, duration: 3, style: messageStyle });
  }
};
