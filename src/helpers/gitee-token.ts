const GITEE_TOKEN_KEY = 'gitee_token';

export const saveGiteeToken = (token: string, expireAt: number, refreshToken: string) => {
  return chrome.storage.sync.set({
    [GITEE_TOKEN_KEY]: {
      token,
      expireAt,
      refreshToken,
    },
  });
};

export const getGiteeToken = async (): Promise<string | null> => {
  const result = await chrome.storage.sync.get(GITEE_TOKEN_KEY);
  if (!result || !result[GITEE_TOKEN_KEY]) {
    return null;
  }
  const tokenInfo = result[GITEE_TOKEN_KEY];
  if (!tokenInfo.expireAt || tokenInfo.expireAt > Date.now()) {
    return tokenInfo.token || null;
  } else {
    console.log('Gitee token expired and need refesh');
    const refreshReq = await fetch(
      `https://gitee.com/oauth/token?grant_type=refresh_token&refresh_token=${tokenInfo.refreshToken}`,
      { method: 'POST' }
    );
    const refreshData = await refreshReq.json();
    if (!refreshData) {
      console.log('Gitee token refresh failed');
      return null;
    }
    await saveGiteeToken(
      refreshData.access_token,
      Date.now() + (refreshData.expires_in - 120) * 1000,
      refreshData.refresh_token
    );
    return refreshData.access_token;
  }
};

export const removeGiteeToken = () => {
  return chrome.storage.sync.remove(GITEE_TOKEN_KEY);
};
