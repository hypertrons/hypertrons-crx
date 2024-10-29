export const saveGiteeToken = (token: string) => {
  chrome.storage.sync.set({ gitee_token: token });
};

export const getGiteeToken = (): Promise<string | null> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get('gitee_token', (result) => {
      resolve(result.gitee_token || null);
    });
  });
};
