let githubToken = '';

export const saveToken = (token: string) => {
  githubToken = token;
  localStorage.setItem('github_token', token);
};

export const getToken = () => {
  if (!githubToken) {
    githubToken = localStorage.getItem('github_token') || '';
  }
  return githubToken;
};

export const githubRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('GitHub Token 未设置');
  }

  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub 请求失败: ${response.statusText}`);
  }

  return response.json();
};
