import React, { useEffect } from 'react';
import { FAST_PR_CONFIG_URL } from '../../constant';
import { createRoot } from 'react-dom/client';

const SandboxApp = () => {
  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;
      const command = data.command;
      const url = data.url;
      let matchedFun = data.matchedFun;
      if (command === 'requestMatchedUrl') {
        fetch(FAST_PR_CONFIG_URL)
          .then((response) => response.text())
          .then((scriptContent) => {
            matchedFun = scriptContent;
            const func = new Function(matchedFun);
            func();
            const matchedUrl = window.matchFastPrUrl(url);
            event.source.postMessage({ matchedUrl, matchedFun: matchedFun, isUpdated: true }, event.origin);
          });
      } else {
        if (matchedFun) {
          const func = new Function(matchedFun);
          func();
          const matchedUrl = window.matchFastPrUrl(url);
          event.source.postMessage({ matchedUrl, matchedFun: matchedFun, isUpdated: false }, event.origin);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div>
      <h1>Sandbox</h1>
      <p>React-based sandbox environment.</p>
    </div>
  );
};

createRoot(document.getElementById('root')).render(<SandboxApp />);
