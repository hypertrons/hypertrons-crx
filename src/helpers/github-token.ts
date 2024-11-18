const GITHUB_TOKEN_KEY = 'github_token';

export const saveGithubToken = (token: string) => {
  return chrome.storage.sync.set({ [GITHUB_TOKEN_KEY]: token });
};

export const getGithubToken = (): Promise<string | null> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(GITHUB_TOKEN_KEY, (result) => {
      resolve(result[GITHUB_TOKEN_KEY] || null);
    });
  });
};

export const removeGithubToken = () => {
  return chrome.storage.sync.remove(GITHUB_TOKEN_KEY);
};
