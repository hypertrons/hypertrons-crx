import React, { useEffect } from 'react';
import { OSS_URL } from '../../constant';
import { createRoot } from 'react-dom/client';

const SandboxApp = () => {
  useEffect(() => {
    const fetchAndExecuteScript = () => {
      fetch(OSS_URL)
        .then((response) => response.text())
        .then((scriptContent) => {
          const func = new Function(scriptContent);
          func();
        });
    };

    fetchAndExecuteScript();

    // Set a timer to run once per hour
    const intervalId = setInterval(
      () => {
        fetchAndExecuteScript();
      },
      60 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      const { command, url } = event.data;
      if (command === 'matchUrl') {
        const matchedUrl = window.matchFastPrUrl(url);
        event.source.postMessage({ matchedUrl }, event.origin);
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
