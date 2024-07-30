import { getToken, saveToken } from '../helpers/github-token';

export const githubRequest = async (endpoint: string, options: RequestInit = {}): Promise<any | null> => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return null;
  }
};

export { saveToken, getToken };


