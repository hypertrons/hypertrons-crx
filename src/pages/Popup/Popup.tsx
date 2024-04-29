import React from 'react';
import { Button } from 'antd';

export default function Popup() {
  return (
    <div>
      <Button
        block
        onClick={() => {
          chrome.runtime.openOptionsPage();
        }}
      >
        Settings
      </Button>
    </div>
  );
}
