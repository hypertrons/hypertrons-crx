export const FILE_URL = (filePath: string, originalRepo: string, branch: string) =>
  `https://raw.githubusercontent.com/${originalRepo}/${branch}/${filePath}`;
// GitHub API URLs
export const BASE_URL = 'https://api.github.com/repos';
export const GET_REPO_INFO = (repoName: string) => `${BASE_URL}/${repoName}`;
export const GET_USER_INFO = 'https://api.github.com/user';
export const CREATE_FORK_URL = (repoName: string) => `${BASE_URL}/${repoName}/forks`;
export const GET_BRANCH_SHA_URL = (branch: string, repoName: string) =>
  `${BASE_URL}/${repoName}/git/ref/heads/${branch}`;
export const CREATE_BRANCH_URL = (repoName: string) => `${BASE_URL}/${repoName}/git/refs`;
export const GET_FILE_SHA_URL = (filePath: string, branch: string, repoName: string) =>
  `${BASE_URL}/${repoName}/contents/${filePath}?ref=${branch}`;
export const CREATE_OR_UPDATE_FILE_URL = (filePath: string, repoName: string) =>
  `${BASE_URL}/${repoName}/contents/${filePath}`;

export const CREATE_PULL_REQUEST_URL = (repoName: string) => `${BASE_URL}/${repoName}/pulls`;
