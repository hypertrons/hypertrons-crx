export const FILE_URL = (filePath: string, originalRepo: string, branch: string) =>
  `https://gitee.com/${originalRepo}/raw/${branch}/${filePath}`;
// Gitee API URLs
export const GITEE_BASE_URL = 'https://gitee.com/api/v5/repos';
export const GET_USER_INFO = 'https://gitee.com/api/v5/user';

export const GET_FILE_URL = (filePath: string, repoName: string) =>
  `${GITEE_BASE_URL}/${repoName}/contents/${filePath}`;
export const GET_REPO_INFO = (repoName: string) => `${GITEE_BASE_URL}/${repoName}`;

export const GET_PERMISSION = (repoName: string, username: string) =>
  `${GITEE_BASE_URL}/${repoName}/collaborators/${username}`;
export const CREATE_FORK_URL = (repoName: string) => `${GITEE_BASE_URL}/${repoName}/forks`;

export const GET_BRANCH_SHA_URL = (branch: string, repoName: string) =>
  `${GITEE_BASE_URL}/${repoName}/branches/${branch}`;

export const CREATE_BRANCH_URL = (repoName: string) => `${GITEE_BASE_URL}/${repoName}/branches`;

export const GET_FILE_SHA_URL = (filePath: string, branch: string, repoName: string) =>
  `${GITEE_BASE_URL}/${repoName}/contents/${filePath}?ref=${branch}`;

export const CREATE_OR_UPDATE_FILE_URL = (filePath: string, repoName: string) =>
  `${GITEE_BASE_URL}/${repoName}/contents/${filePath}`;

export const CREATE_PULL_REQUEST_URL = (repoName: string) => `${GITEE_BASE_URL}/${repoName}/pulls`;
