import React, { useState, useEffect } from 'react';
import { CommentOutlined, CloseOutlined } from '@ant-design/icons';
import { ThemeProvider } from 'antd-style';
import { FloatButton, Popover, theme } from 'antd';
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
    <ThemeProvider
      appearance={githubTheme}
      theme={(appearance) =>
        appearance === 'dark'
          ? {
              algorithm: theme.darkAlgorithm,
            }
          : undefined
      }
    >
      <Popover
        content={<OssGpt githubTheme={githubTheme} />}
        title={<div className="OSSGPT_title">OSS-GPT</div>}
        placement="topRight"
        arrow={false}
        overlayStyle={{ position: 'fixed', bottom: 130, right: 12, width: 564, height: 580 }}
        destroyTooltipOnHide={true}
        open={isOpen}
      >
        <FloatButton
          type="default"
          style={{ right: 24, bottom: 24, height: 50, width: 50, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
          icon={<span className="float-btn-icon">{isOpen ? <CloseOutlined /> : <CommentOutlined />}</span>}
          onClick={switchIcon}
        ></FloatButton>
      </Popover>
    </ThemeProvider>
  );
};

export default View;
