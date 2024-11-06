// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'loadAndExecuteUrlMatcher') {
    const worker = new Worker(chrome.runtime.getURL('../workers/worker.js'));
    console.log('worker', worker);
    worker.postMessage({ url: request.url, currentUrl: request.currentUrl });

    worker.onmessage = function (event) {
      if (event.data.success) {
        sendResponse({ success: true, matchedUrl: event.data.matchedUrl });
      } else {
        sendResponse({ success: false, error: event.data.error });
      }
      worker.terminate();
    };

    worker.onerror = function (error) {
      sendResponse({ success: false, error: 'Worker error: ' + error.message });
      worker.terminate();
    };

    return true; // 表示异步响应
  }
});
