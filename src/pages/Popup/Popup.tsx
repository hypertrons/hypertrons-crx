import React from 'react';

export default function Popup() {
  return (
    <div>
      <button
        onClick={() => {
          chrome.runtime.openOptionsPage();
        }}
      >
        Settings
      </button>
    </div>
  );
}
