import * as url from './githubUrl';
import { handleMessage } from './handleMessage';
import type { FormInstance } from 'antd/lib/form';
import { getToken } from '../../../../helpers/github-token';
export const PR_TITLE = (file: string) => `docs: Update ${file}`;
export const PR_CONTENT = (file: string) => `Update ${file} by [FastPR](https://github.com/hypertrons/hypertrons-crx).`;

const generateBranchName = () => `fastPR-${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}`;
const COMMIT_MESSAGE = (branch: string) => `docs: ${branch}`;
// Check if the repo has been forked
const checkRepositoryPermission = async (repoName: string, githubToken: string) => {
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github.v3+json',
  };

  // Step 1: Obtain repo information and check permissions
  const repoResponse = await fetch(url.GET_REPO_INFO(repoName), { headers });
  if (!repoResponse.ok) {
    return {
      success: false,
      message: `Failed to fetch repository info: ${repoResponse.status}`,
    };
  }

  const repoData = await repoResponse.json();

  // Check if the user has write permission
  if (repoData.permissions && repoData.permissions.push) {
    return {
      success: true,
      permission: true,
    };
  } else {
    return {
      success: true,
      permission: false,
    };
  }
};

// Create a new fork
const getOrCreateFork = async (repoName: string, githubToken: string) => {
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github.v3+json',
  };

  // Step 1: Obtain information about the current user
  const userResponse = await fetch(url.GET_USER_INFO, { headers });
  if (!userResponse.ok) {
    return {
      success: false,
      message: `Failed to fetch user info: ${userResponse.status}`,
    };
  }
  const userData = await userResponse.json();
  const currentUser = userData.login;

  // Step 2: Check if the fork already exists
  const forksResponse = await fetch(url.CREATE_FORK_URL(repoName), { headers });
  if (!forksResponse.ok) {
    return {
      success: false,
      message: `Failed to fetch fork info: ${forksResponse.status}`,
    };
  }
  const forks = await forksResponse.json();

  const existingFork = forks.find((fork: any) => fork.owner.login === currentUser);
  if (existingFork) {
    return {
      success: true,
      forkName: existingFork.full_name, // Return the complete name of an existing fork
    };
  }

  //Step 3: If there is no fork, create a new fork
  const forkResponse = await fetch(url.CREATE_FORK_URL(repoName), {
    method: 'POST',
    headers,
  });
  if (!forkResponse.ok) {
    return {
      success: false,
      message: `Failed to create fork: ${forkResponse.status}`,
    };
  }
  const forkData = await forkResponse.json();
  return {
    success: true,
    forkName: forkData.full_name, // Return the complete name of an existing fork
  };
};
//Get the latest SHA submission for the default branch
const getBranchLatestCommitSha = async (prRepo: string, branch: string, githubToken: string) => {
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github.v3+json',
  };
  const response = await fetch(url.GET_BRANCH_SHA_URL(branch, prRepo), {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    return {
      success: false,
      message: `Failed to get the latest SHA submissio: ${response.status}`,
    };
  }
  const data = await response.json();
  return {
    success: true,
    baseBranchSha: data.object.sha,
  };
};
//Create a new branch
const createBranch = async (newBranch: string, baseBranchSha: string, prRepo: string, githubToken: string) => {
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github.v3+json',
  };
  const response = await fetch(url.CREATE_BRANCH_URL(prRepo), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ref: `refs/heads/${newBranch}`,
      sha: baseBranchSha,
    }),
  });
  if (!response.ok) {
    return {
      success: false,
      message: `Failed to create a new branch: ${response.status}`,
    };
  }
  return {
    success: true,
  };
};
//Retrieve the SHA value of the file
const getFileSha = async (filePath: string, newBranch: string, prRepo: string, githubToken: string) => {
  const response = await fetch(url.GET_FILE_SHA_URL(filePath, newBranch, prRepo), {
    headers: { Authorization: `Bearer ${githubToken}` },
  });
  if (!response.ok) {
    return {
      success: false,
      message: `Failed to get the SHA value of the file: ${response.status}`,
    };
  }
  const data = await response.json();
  return {
    success: true,
    fileSha: data.sha || null,
  };
};
//Create or update file content
const createOrUpdateFileContent = async (
  filePath: string,
  content: string,
  newBranch: string,
  fileSha: string | null,
  prRepo: string,
  githubToken: string
) => {
  const response = await fetch(url.CREATE_OR_UPDATE_FILE_URL(filePath, prRepo), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${githubToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: COMMIT_MESSAGE(newBranch),
      content: Buffer.from(content).toString('base64'),
      branch: newBranch,
      sha: fileSha,
    }),
  });
  if (!response.ok) {
    return {
      success: false,
      message: `Failed to create or update file content: ${response.status}`,
    };
  }
  return {
    success: true,
  };
};
//Create a new PR
const createPullRequest = async (
  prTitle: string,
  prContent: string,
  newBranch: string,
  branch: string,
  forkOwner: string | null,
  originalRepo: string,
  githubToken: string
) => {
  const head = forkOwner ? `${forkOwner}:${newBranch}` : newBranch;
  const response = await fetch(url.CREATE_PULL_REQUEST_URL(originalRepo), {
    method: 'POST',
    headers: { Authorization: `Bearer ${githubToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: prTitle,
      body: prContent,
      head: head,
      base: branch,
    }),
  });
  if (!response.ok) {
    return {
      success: false,
      message: `Failed to create a new PR: ${response.status}`,
    };
  }
  const data = await response.json();
  return {
    success: true,
    html_url: data.html_url,
  };
};
export const submitGithubPR = async (
  form: FormInstance<any>,
  originalRepo: string,
  branch: string,
  filePath: string,
  fileContent: string
) => {
  const key = 'FastPR';
  const values = await form.validateFields();
  handleMessage('loading', 'Get github token...', key);
  const githubToken = await getToken();
  if (!githubToken) {
    handleMessage('error', 'Failed to get github token.', key);
    return;
  }
  const newBranch = generateBranchName();
  handleMessage('loading', `Checking repository permission...`, key);
  const permissionResult = await checkRepositoryPermission(originalRepo, githubToken);
  if (!permissionResult.success && permissionResult.message) {
    handleMessage('error', permissionResult.message, key);
    return;
  }
  let prRepo = originalRepo;
  let forkOwner: string | null = null;
  if (!permissionResult.permission) {
    handleMessage('loading', `get or create fork...`, key);
    const prRepoResult = await getOrCreateFork(originalRepo, githubToken);
    if (!prRepoResult.success && prRepoResult.message) {
      handleMessage('error', prRepoResult.message, key);
      return;
    }
    prRepo = prRepoResult.forkName;
    forkOwner = prRepo.split('/')[0];
  }
  //Get the latest SHA submission for the default branch
  handleMessage('loading', `Get latest commit sha of the base branch...`, key);
  const baseBranchShaResult = await getBranchLatestCommitSha(originalRepo, branch, githubToken);
  if (!baseBranchShaResult.success && baseBranchShaResult.message) {
    handleMessage('error', baseBranchShaResult.message, key);
    return;
  }
  const baseBranchSha = baseBranchShaResult.baseBranchSha;
  //Create a new branch
  handleMessage('loading', `Creating new branch...`, key);
  const branchCreated = await createBranch(newBranch, baseBranchSha, prRepo, githubToken);
  if (!branchCreated.success && branchCreated.message) {
    handleMessage('error', branchCreated.message, key);
    return;
  }
  //Retrieve the SHA value of the file
  handleMessage('loading', `Get file sha...`, key);
  const fileShaResult = await getFileSha(filePath, newBranch, prRepo, githubToken);
  if (!fileShaResult.success && fileShaResult.message) {
    handleMessage('error', fileShaResult.message, key);
    return;
  }
  const fileSha = fileShaResult.fileSha;
  //Create or update file content
  handleMessage('loading', `Creating or Updating file content...`, key);
  const fileUpdatedResult = await createOrUpdateFileContent(
    filePath,
    fileContent,
    newBranch,
    fileSha,
    prRepo,
    githubToken
  );
  if (!fileUpdatedResult.success && fileUpdatedResult.message) {
    handleMessage('error', fileUpdatedResult.message, key);
    return;
  }
  //Create a new PR
  handleMessage('loading', `Creating PR...`, key);
  const prUrlResult = await createPullRequest(
    values.title,
    values.content,
    newBranch,
    branch,
    forkOwner,
    originalRepo,
    githubToken
  );
  if (!prUrlResult.success && prUrlResult.message) {
    handleMessage('error', prUrlResult.message, key);
    return;
  }
  handleMessage('success', 'PR created successfully.', key);
};
