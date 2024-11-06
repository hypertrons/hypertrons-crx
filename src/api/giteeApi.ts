import { getGiteeToken, saveGiteeToken } from '../helpers/gitee-token';

export const giteeRequest = async (endpoint: string, options: RequestInit = {}): Promise<any | null> => {
  const token = await getGiteeToken();
  if (!token) {
    return null;
  }

  const url = `https://gitee.com/api/v5/${endpoint}?access_token=${token}`;

  try {
    const response = await fetch(url, {
      ...options,
    });
    return response.json();
  } catch (error) {
    return null;
  }
};

export { saveGiteeToken, getGiteeToken };
