import { getGithubToken, saveGithubToken } from '../helpers/github-token';

export const githubRequest = async (endpoint: string, options: RequestInit = {}): Promise<any | null> => {
  const token = await getGithubToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...options,
    });
    return response.json();
  } catch (error) {
    return null;
  }
};

export { saveGithubToken, getGithubToken };
