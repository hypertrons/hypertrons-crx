import React from 'react';
import { message } from 'antd';

const messageStyle = {
  fontSize: '16px',
  padding: '24px 24px',
  width: '600px',
  margin: '0 auto',
};

export const handleMessage = (status: string, content: string, key: string) => {
  const contentWithLink = (
    <div>
      {content.split('\n').map((text, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {text.includes('http') ? (
            <>
              {text.trim().split(' ')[0]} {text.trim().split(' ')[1]}{' '}
              <a href={text.trim().split(' ')[2]} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                {text.trim().split(' ')[2]}
              </a>
            </>
          ) : (
            text
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (status === 'loading') {
    message.loading({ content, key, style: messageStyle });
    return;
  }
  if (status === 'success') {
    message.success({ content: contentWithLink, key, duration: 6, style: messageStyle });
  } else if (status === 'error') {
    message.error({ content: contentWithLink, key, duration: 3, style: messageStyle });
  }
};
