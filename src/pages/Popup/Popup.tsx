import { number } from 'echarts';
import React, { useState } from 'react';
import { Space, Button } from 'antd';

export default function Popup() {
  // refer: https://developer.chrome.com/docs/extensions/mv3/messaging/#simple
  const openFeatureInContentScript = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id!, {
      greeting: 'demo',
    });
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100px' }}>
      <Space direction="vertical">
        <Button
          type="text"
          block
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
        >
          Settings
        </Button>
        <Button type="text" block onClick={openFeatureInContentScript}>
          Charts
        </Button>
      </Space>
    </div>
  );
}
