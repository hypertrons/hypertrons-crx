import { handleMessage } from './handleMessage';
import type { FormInstance } from 'antd/lib/form';
import { getGithubToken } from '../../../../helpers/github-token';
import i18n from '../../../../helpers/i18n';
import { Octokit } from '@octokit/rest';
import { generateBranchName, COMMIT_MESSAGE, COMMIT_MESSAGE_DOC } from './baseContent';

const t = i18n.t;

const getOrCreateFork = async (owner: string, repo: string, octokit: Octokit) => {
  const fastprRepo = `fastpr-${owner}-${repo}`;
  const newRepoName = `${fastprRepo}`;
  try {
    const forkResponse = await octokit.repos.createFork({
      owner: owner,
      repo: repo,
      name: newRepoName,
      default_branch_only: true,
    });

    return {
      success: true,
      forkName: forkResponse.data.full_name,
    };
  } catch (error: any) {
    return {
      success: false,
      forkName: '',
      message: t('error_get_or_create_fork', { status: error.message }),
    };
  }
};
//Get the latest SHA submission for the default branch
const getBranchLatestCommitSha = async (owner: string, repo: string, branch: string, octokit: Octokit) => {
  try {
    const response = await octokit.git.getRef({
      owner: owner,
      repo: repo,
      ref: `heads/${branch}`,
    });

    return {
      success: true,

      baseBranchSha: response.data.object.sha,
    };
  } catch (error: any) {
    return {
      success: false,
      baseBranchSha: '',
      message: t('error_get_latest_sha', { status: error.message }),
    };
  }
};
//Create a new branch
const createBranch = async (
  newBranch: string,
  baseBranchSha: string,
  owner: string,
  repo: string,
  octokit: Octokit
) => {
  try {
    await octokit.git.createRef({
      owner: owner,
      repo: repo,
      ref: `refs/heads/${newBranch}`,
      sha: baseBranchSha,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: t('error_create_branch', { status: error.message }),
    };
  }
};
//Retrieve the SHA value of the file
const getFileSha = async (
  filePath: string,
  newBranch: string,
  forkOwner: string,
  forkRepo: string,
  octokit: Octokit
) => {
  try {
    const response = await octokit.repos.getContent({
      owner: forkOwner,
      repo: forkRepo,
      path: filePath,
      ref: newBranch,
    });
    if (Array.isArray(response.data)) {
      return {
        success: false,
        fileSha: '',
        message: t('error_get_file'),
      };
    }

    return {
      success: true,
      fileSha: response.data.sha || null,
    };
  } catch (error: any) {
    return {
      success: false,
      fileSha: '',
      message: t('error_get_file_sha', { status: error.message }),
    };
  }
};
//Create or update file content
const createOrUpdateFileContent = async (
  filePath: string,
  content: string,
  newBranch: string,
  fileSha: string | null,
  forkOwner: string,
  forkRepo: string,
  octokit: Octokit
) => {
  try {
    const user = await octokit.users.getAuthenticated();
    const userName = user.data.name;
    const userEmail = user.data.email;
    await octokit.repos.createOrUpdateFileContents({
      owner: forkOwner,
      repo: forkRepo,
      path: filePath,
      message: userName && userEmail ? COMMIT_MESSAGE_DOC(newBranch, userName, userEmail) : COMMIT_MESSAGE(newBranch),
      content: Buffer.from(content).toString('base64'),
      branch: newBranch,
      sha: fileSha || undefined,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: t('error_update_file_content', { status: error.message }),
    };
  }
};
//Create a new PR
const createPullRequest = async (
  prTitle: string,
  prContent: string,
  newBranch: string,
  branch: string,
  forkOwner: string,
  originalRepo: string,
  octokit: Octokit
) => {
  try {
    const head = `${forkOwner}:${newBranch}`;
    const response = await octokit.pulls.create({
      owner: originalRepo.split('/')[0],
      repo: originalRepo.split('/')[1],
      title: prTitle,
      body: prContent,
      head: head,
      base: branch,
    });

    return {
      success: true,
      html_url: response.data.html_url,
    };
  } catch (error: any) {
    return {
      success: false,
      message: t('error_create_pr', { status: error.message }),
    };
  }
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
  handleMessage('loading', t('status_get_github_token'), key);
  const githubToken = await getGithubToken();
  if (!githubToken) {
    handleMessage('error', t('error_get_github_token'), key);
    return;
  }
  const originalOwner = originalRepo.split('/')[0];
  const repo = originalRepo.split('/')[1];
  const octokit = new Octokit({ auth: githubToken });
  const newBranch = generateBranchName();
  handleMessage('loading', t('status_get_or_create_fork'), key);
  const prRepoResult = await getOrCreateFork(originalOwner, repo, octokit);
  if (!prRepoResult.success && prRepoResult.message) {
    handleMessage('error', prRepoResult.message, key);
    return;
  }
  const prRepo = prRepoResult.forkName;
  const forkOwner = prRepo.split('/')[0];
  const forkRepo = prRepo.split('/')[1];
  //Get the latest SHA submission for the default branch
  handleMessage('loading', t('status_get_latest_commit_sha'), key);
  const baseBranchShaResult = await getBranchLatestCommitSha(originalOwner, repo, branch, octokit);
  if (!baseBranchShaResult.success && baseBranchShaResult.message) {
    handleMessage('error', baseBranchShaResult.message, key);
    return;
  }
  const baseBranchSha = baseBranchShaResult.baseBranchSha;
  //Create a new branch
  handleMessage('loading', t('status_create_branch'), key);
  const branchCreated = await createBranch(newBranch, baseBranchSha, forkOwner, forkRepo, octokit);
  if (!branchCreated.success && branchCreated.message) {
    handleMessage('error', branchCreated.message, key);
    return;
  }
  //Retrieve the SHA value of the file
  handleMessage('loading', t('status_get_file_sha'), key);
  const fileShaResult = await getFileSha(filePath, newBranch, forkOwner, forkRepo, octokit);
  if (!fileShaResult.success && fileShaResult.message) {
    handleMessage('error', fileShaResult.message, key);
    return;
  }
  const fileSha = fileShaResult.fileSha;
  //Create or update file content
  handleMessage('loading', t('status_update_file_content'), key);
  const fileUpdatedResult = await createOrUpdateFileContent(
    filePath,
    fileContent,
    newBranch,
    fileSha,
    forkOwner,
    forkRepo,
    octokit
  );
  if (!fileUpdatedResult.success && fileUpdatedResult.message) {
    handleMessage('error', fileUpdatedResult.message, key);
    return;
  }
  //Create a new PR
  handleMessage('loading', t('status_create_pr'), key);
  const prUrlResult = await createPullRequest(
    values.title,
    values.content,
    newBranch,
    branch,
    forkOwner,
    originalRepo,
    octokit
  );
  if (!prUrlResult.success && prUrlResult.message) {
    handleMessage('error', prUrlResult.message, key);
    return;
  }
  handleMessage('success', t('success_create_pr', { url: prUrlResult.html_url }), key);
};
