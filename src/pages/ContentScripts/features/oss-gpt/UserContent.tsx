import Markdown from './components/Markdown';
import React, { type FC } from 'react';
import './index.css';
interface IProps {
  text: string;
}

const UserContent: FC<IProps> = ({ text }) => {
  return (
    <div className="ant-pro-chat-list-item-message-content">
      {text && (
        <Markdown
          style={{
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          {text}
        </Markdown>
      )}
    </div>
  );
};

export default UserContent;
