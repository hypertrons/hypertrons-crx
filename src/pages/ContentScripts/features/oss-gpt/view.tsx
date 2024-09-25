import React, { useState, useEffect } from 'react';
import { CommentOutlined, CloseOutlined } from '@ant-design/icons';
import { FloatButton, Popover, theme, ConfigProvider } from 'antd';
import OssGpt from './OssGpt';
import eventEmitter from '../../../../helpers/eventEmitter';
interface Props {
  githubTheme: 'light' | 'dark';
}
const View = ({ githubTheme }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const switchIcon = () => {
    setIsOpen(!isOpen);
  };
  return (
    <ConfigProvider
      theme={{
        algorithm: githubTheme == 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Popover
        content={<OssGpt />}
        title={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 30 }}>OSS-GPT</div>
        }
        placement="topRight"
        arrow={false}
        overlayStyle={{ position: 'fixed', bottom: 130, right: 12, width: 524, height: 580 }}
        destroyTooltipOnHide={true}
        open={isOpen}
      >
        <FloatButton
          type="default"
          style={{ right: 24, bottom: 24, height: 50, width: 50, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
          icon={
            <span
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
            >
              {isOpen ? <CloseOutlined style={{ fontSize: 24 }} /> : <CommentOutlined style={{ fontSize: 24 }} />}
            </span>
          }
          onClick={switchIcon}
        ></FloatButton>
      </Popover>
    </ConfigProvider>
  );
};

export default View;
