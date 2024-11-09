import * as url from './giteeUrl';
import { handleMessage } from './handleMessage';
import type { FormInstance } from 'antd/lib/form';
import i18n from '../../../../helpers/i18n';
import { getGiteeToken } from '../../../../helpers/gitee-token';
import { generateBranchName, COMMIT_MESSAGE, COMMIT_MESSAGE_DOC } from './baseContent';
const t = i18n.t;
let userName: string | null;
let userEmail: string | null;
//Get the forked repository
const getOrCreateFork = async (repoName: string, giteeToken: string) => {
  const userResponse = await fetch(url.GET_USER_INFO, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${giteeToken}`,
      Accept: 'application/json',
    },
  });

  if (!userResponse.ok) {
    return {
      success: false,
      message: t('error_get_user_info', { status: userResponse.status }),
    };
  }

  const userData = await userResponse.json();
  const owner = userData.login;
  userName = userData.name;
  userEmail = userData.email;
  const fastprRepo = `fastpr-${repoName.split('/')[0]}-${repoName.split('/')[1]}`;
  const newRepoName = `${fastprRepo}`;
  const repourl = `https://gitee.com/api/v5/repos/${owner}/${newRepoName}`;
  const response = await fetch(repourl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${giteeToken}`,
      Accept: 'application/json',
    },
  });

  if (response.ok) {
    return {
      success: true,
      forkName: `${owner}/${newRepoName}`, // Return the complete name of an existing fork
    };
  }
  const forkResponse = await fetch(url.CREATE_FORK_URL(repoName), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${giteeToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: newRepoName,
      path: newRepoName,
    }),
  });
  if (!forkResponse.ok) {
    return {
      success: false,
      message: t('error_get_or_create_fork', { status: forkResponse.status }),
    };
  }
  const forkData = await forkResponse.json();
  return {
    success: true,
    forkName: forkData.full_name, // Return the complete name of an existing fork
  };
};
//Create a new branch
const createBranch = async (newBranch: string, branch: string, prRepo: string, giteeToken: string) => {
  const headers = {
    Authorization: `Bearer ${giteeToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const response = await fetch(url.CREATE_BRANCH_URL(prRepo), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      refs: branch,
      branch_name: newBranch,
    }),
  });
  if (!response.ok) {
    return {
      success: false,
      message: t('error_create_branch', { status: response.status }),
    };
  }
  return {
    success: true,
  };
};
//Retrieve the SHA value of the file
const getFileSha = async (filePath: string, newBranch: string, prRepo: string, giteeToken: string) => {
  const response = await fetch(url.GET_FILE_SHA_URL(filePath, newBranch, prRepo), {
    headers: {
      Authorization: `Bearer ${giteeToken}`,
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    return {
      success: false,
      message: t('error_get_file_sha', { status: response.status }),
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
  giteeToken: string
) => {
  const response = await fetch(url.CREATE_OR_UPDATE_FILE_URL(filePath, prRepo), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${giteeToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      message: userName && userEmail ? COMMIT_MESSAGE_DOC(newBranch, userName, userEmail) : COMMIT_MESSAGE(newBranch),
      content: Buffer.from(content).toString('base64'),
      branch: newBranch,
      sha: fileSha,
    }),
  });
  if (!response.ok) {
    return {
      success: false,
      message: t('error_update_file_content', { status: response.status }),
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
  forkRepo: string | null,
  originalRepo: string,
  giteeToken: string
) => {
  const head = forkRepo != originalRepo ? `${forkRepo}:${newBranch}` : newBranch;
  console.log(head);
  const response = await fetch(url.CREATE_PULL_REQUEST_URL(originalRepo), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${giteeToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      title: prTitle,
      body: prContent,
      head: head,
      base: branch,
    }),
  });
  console.log(response);
  if (!response.ok) {
    return {
      success: false,
      message: t('error_create_pr', { status: response.status }),
    };
  }
  const data = await response.json();
  return {
    success: true,
    html_url: data.html_url,
  };
};
export const submitGiteePR = async (
  form: FormInstance<any>,
  originalRepo: string,
  branch: string,
  filePath: string,
  fileContent: string
) => {
  const key = 'FastPR';
  const values = await form.validateFields();
  handleMessage('loading', t('status_get_gitee_token'), key);
  const giteeToken = await getGiteeToken();
  if (!giteeToken) {
    handleMessage('error', t('error_get_gitee_token'), key);
    return;
  }
  const newBranch = generateBranchName();
  handleMessage('loading', t('status_get_or_create_fork'), key);
  const prRepoResult = await getOrCreateFork(originalRepo, giteeToken);
  if (prRepoResult.success && prRepoResult.message) {
    handleMessage('error', prRepoResult.message, key);
    return;
  }
  let prRepo = prRepoResult.forkName;
  //Create a new branch
  handleMessage('loading', t('status_create_branch'), key);
  const branchCreated = await createBranch(newBranch, branch, prRepo, giteeToken);
  if (!branchCreated.success && branchCreated.message) {
    handleMessage('error', branchCreated.message, key);
    return;
  }
  //Retrieve the SHA value of the file
  handleMessage('loading', t('status_get_file_sha'), key);
  const fileShaResult = await getFileSha(filePath, newBranch, prRepo, giteeToken);
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
    prRepo,
    giteeToken
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
    prRepo,
    originalRepo,
    giteeToken
  );
  if (!prUrlResult.success && prUrlResult.message) {
    handleMessage('error', prUrlResult.message, key);
    return;
  }
  handleMessage('success', t('success_create_pr', { url: prUrlResult.html_url }), key);
};
