import React, { useEffect } from 'react';
import { OSS_URL } from '../../constant';
import { createRoot } from 'react-dom/client';
const SandboxApp = () => {
  useEffect(() => {
    fetch(OSS_URL)
      .then((response) => response.text())
      .then((scriptContent) => {
        const func = new Function(scriptContent);
        func();
        window.addEventListener('message', (event) => {
          const { command, url } = event.data;
          if (command === 'matchUrl') {
            try {
              const matchedUrl = window.matchFastPrUrl(url);
              event.source.postMessage({ matchedUrl }, event.origin);
            } catch (error) {
              event.source.postMessage({ error: error.message }, event.origin);
            }
          }
        });
      });
  }, []);

  return (
    <div>
      <h1>Sandbox</h1>
      <p>React-based sandbox environment.</p>
    </div>
  );
};
createRoot(document.getElementById('root')).render(<SandboxApp />);
