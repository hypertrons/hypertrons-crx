export const saveToken = (token: string) => {
  chrome.storage.sync.set({ github_token: token });
};

export const getToken = (): Promise<string | null> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get('github_token', (result) => {
      resolve(result.github_token || null);
    });
  });
};
