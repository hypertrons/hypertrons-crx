import React, { useState, useEffect } from 'react';
import { FormOutlined } from '@ant-design/icons';
import { FloatButton, Modal, Form, Input, Button } from 'antd';
import { getToken } from '../../../../helpers/github-token';
interface Props {
  filePath: string;
  originalRepo: string;
  branch: string;
}

const FILE_URL = (filePath: string, originalRepo: string, branch: string) =>
  `https://raw.githubusercontent.com/${originalRepo}/${branch}/${filePath}`;
// GitHub API URLs
const BASE_URL = 'https://api.github.com/repos';
const GET_REPO_INFO = (repoName: string) => `${BASE_URL}/${repoName}`;
const GET_USER_INFO = 'https://api.github.com/user';
const CREATE_FORK_URL = (repoName: string) => `${BASE_URL}/${repoName}/forks`;
const GET_BRANCH_SHA_URL = (branch: string, repoName: string) => `${BASE_URL}/${repoName}/git/ref/heads/${branch}`;
const CREATE_BRANCH_URL = (repoName: string) => `${BASE_URL}/${repoName}/git/refs`;
const GET_FILE_SHA_URL = (filePath: string, branch: string, repoName: string) =>
  `${BASE_URL}/${repoName}/contents/${filePath}?ref=${branch}`;
const CREATE_OR_UPDATE_FILE_URL = (filePath: string, repoName: string) =>
  `${BASE_URL}/${repoName}/contents/${filePath}`;

const CREATE_PULL_REQUEST_URL = (repoName: string) => `${BASE_URL}/${repoName}/pulls`;
const generateBranchName = () => `fastPR-${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}`;
const COMMIT_MESSAGE = (branch: string) => `docs: ${branch}`;
const PR_TITLE = (file: string) => `docs: Update ${file}`;
const PR_CONTENT = (file: string) => `Update ${file} by [FastPR](https://github.com/hypertrons/hypertrons-crx).`;
const View = ({ filePath, originalRepo, branch }: Props) => {
  //   const FILE_URL= `https://raw.githubusercontent.com/${repoName}/${branch}/${filePath}`;
  const fileUrl = FILE_URL(filePath, originalRepo, branch);
  console.log(fileUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Initial button position
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 }); // Starting position when mouse is pressed
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Offset when dragging
  const [dragged, setDragged] = useState(false); // Flag to detect if drag occurred
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Create form instance
  const [fileContent, setFileContent] = useState('');
  const buttonSize = 50; // Button size
  const padding = 24; // Padding from the screen edges
  const dragThreshold = 5; // Threshold to distinguish dragging from clicking
  // Click the icon
  const clickIcon = () => {
    const Stackedit = require('stackedit-js');
    const stackedit = new Stackedit();
    let originalContent = '';
    let content = '';

    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        document.body.style.overflow = 'hidden';
        originalContent = data;
        stackedit.openFile({ content: { text: originalContent } });
      })
      .catch((error) => {
        alert(`Fetch error: ${error.message}`);
      });

    stackedit.on('fileChange', (file: any) => {
      content = file.content.text;
      setFileContent(content);
    });

    stackedit.on('close', () => {
      document.body.style.overflow = '';
      if (originalContent.charCodeAt(originalContent.length - 1) === 10) {
        content += String.fromCharCode(10);
      }
      if (originalContent != content) {
        // If content has changed, handle PR creation
        setIsModalOpen(true);
      }
    });
  };

  const submitPR = async () => {
    // Here, you'd include logic to create a pull request, using GitHub API or any method
    const values = await form.validateFields();
    const githubToken = await getToken();
    if (!githubToken) throw new Error('No github token found');
    const newBranch = generateBranchName();
    const hasWritePermission = await checkRepositoryPermission(originalRepo, githubToken);
    let prRepo = originalRepo;
    let forkOwner: string | null = null;
    if (!hasWritePermission) {
      prRepo = await getOrCreateFork(originalRepo, githubToken);
      forkOwner = prRepo.split('/')[0];
    }
    // 获取默认分支的最新提交 SHA
    const baseBranchSha = await getBranchLatestCommitSha(prRepo, githubToken);
    if (!baseBranchSha) throw new Error('Failed to get base branch SHA.');
    console.log(1);
    // 创建新分支
    const branchCreated = await createBranch(newBranch, baseBranchSha, prRepo, githubToken);
    if (!branchCreated) throw new Error('Failed to create branch.');
    console.log(2);
    // 获取文件 SHA（如果文件已存在）
    const fileSha = await getFileSha(filePath, newBranch, prRepo, githubToken);
    console.log(fileSha);
    console.log(3);
    // 创建或更新文件内容
    const fileUpdated = await createOrUpdateFileContent(filePath, fileContent, newBranch, fileSha, prRepo, githubToken);
    if (!fileUpdated) throw new Error('Failed to create or update file content.');
    console.log(4);
    // 创建拉取请求
    const prUrl = await createPullRequest(
      values.title,
      values.content,
      newBranch,
      forkOwner,
      originalRepo,
      githubToken
    );
    if (!prUrl) throw new Error('Failed to create pull request.');
    console.log(5);
    console.log(`Pull request created successfully: ${prUrl}`);
    setIsModalOpen(false); // Close modal after submission
    form.resetFields(); // Reset form after submission
  };

  // 检查仓库是否已经 fork
  const checkRepositoryPermission = async (repoName: string, githubToken: string) => {
    const headers = {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github.v3+json',
    };

    // Step 1: 获取仓库信息，检查权限
    const repoResponse = await fetch(GET_REPO_INFO(repoName), { headers });
    if (!repoResponse.ok) {
      throw new Error(`Failed to fetch repository info: ${repoResponse.status}`);
    }
    const repoData = await repoResponse.json();

    // 检查用户是否有写入权限
    if (repoData.permissions && repoData.permissions.push) {
      console.log('User has write permission to the repository.');
      return true; // 用户有写入权限
    } else {
      console.log('User does not have write permission to the repository.');
      return false; // 用户没有写入权限
    }
  };

  // 创建一个新的 fork
  const getOrCreateFork = async (repoName: string, githubToken: string) => {
    const headers = {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github.v3+json',
    };

    // Step 1: 获取当前用户的信息
    const userResponse = await fetch(GET_USER_INFO, { headers });
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user information');
    }
    const userData = await userResponse.json();
    const currentUser = userData.login;

    // Step 2: 检查是否已存在 fork
    const forksResponse = await fetch(CREATE_FORK_URL(repoName), { headers });
    if (!forksResponse.ok) {
      throw new Error('Failed to fetch fork information');
    }
    const forks = await forksResponse.json();

    const existingFork = forks.find((fork: any) => fork.owner.login === currentUser);
    if (existingFork) {
      console.log(`Fork exists: ${existingFork.full_name}`);
      return existingFork.full_name; // 返回已经存在的 fork 的完整名称
    }

    // Step 3: 如果没有 fork，创建新的 fork
    const forkResponse = await fetch(CREATE_FORK_URL(repoName), {
      method: 'POST',
      headers,
    });
    if (forkResponse.ok) {
      const forkData = await forkResponse.json();
      return forkData.full_name; // 返回新的 fork 仓库的完整名称
    }
    return null;
  };
  // 获取默认分支的最新提交 SHA
  const getBranchLatestCommitSha = async (prRepo: string, githubToken: string) => {
    const response = await fetch(GET_BRANCH_SHA_URL(branch, prRepo), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const data = await response.json();
    return data.object.sha;
  };
  //创建一个新分支
  const createBranch = async (newBranch: string, baseBranchSha: string, prRepo: string, githubToken: string) => {
    const response = await fetch(CREATE_BRANCH_URL(prRepo), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        ref: `refs/heads/${newBranch}`,
        sha: baseBranchSha,
      }),
    });
    return response.ok;
  };
  //获取文件的 SHA 值
  const getFileSha = async (filePath: string, newBranch: string, prRepo: string, githubToken: string) => {
    const response = await fetch(GET_FILE_SHA_URL(filePath, newBranch, prRepo), {
      headers: { Authorization: `Bearer ${githubToken}` },
    });
    const data = await response.json();
    console.log(data);
    return data.sha || null;
  };
  //创建或更新文件内容
  const createOrUpdateFileContent = async (
    filePath: string,
    content: string,
    newBranch: string,
    fileSha: string | null,
    prRepo: string,
    githubToken: string
  ) => {
    const response = await fetch(CREATE_OR_UPDATE_FILE_URL(filePath, prRepo), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${githubToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: COMMIT_MESSAGE(newBranch),
        content: Buffer.from(content).toString('base64'),
        branch: newBranch,
        sha: fileSha,
      }),
    });
    return response.ok;
  };
  //创建一个新的pr
  const createPullRequest = async (
    prTitle: string,
    prContent: string,
    newBranch: string,
    forkOwner: string | null,
    originalRepo: string,
    githubToken: string
  ) => {
    const head = forkOwner ? `${forkOwner}:${newBranch}` : newBranch;
    const response = await fetch(CREATE_PULL_REQUEST_URL(originalRepo), {
      method: 'POST',
      headers: { Authorization: `Bearer ${githubToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: prTitle,
        body: prContent,
        head: head,
        base: branch,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.html_url;
    }
    return null;
  };
  // Modal cancel handler
  const handleCancel = () => {
    setIsModalOpen(false); // Close modal without action
    form.resetFields();
  };

  // Set the initial position to the middle-right of the screen when the component loads
  useEffect(() => {
    const initialX = window.innerWidth - buttonSize - padding; // 24px from the right of the screen
    const initialY = window.innerHeight / 2 - buttonSize / 2; // Center vertically
    setPosition({ x: initialX, y: initialY });
  }, []);
  // Record the starting position when the mouse is pressed
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY }); // Save the position where the mouse was pressed
    setOffset({ x: position.x, y: position.y }); // Save the current button position

    setDragged(false); // Reset dragged flag
  };

  // Update the position as the mouse moves
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startPosition.x;
      const deltaY = e.clientY - startPosition.y;

      // If the mouse moves more than the threshold, it's a dragging action
      if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        setDragged(true); // Mark that drag has occurred

        const newX = offset.x + deltaX;
        const newY = offset.y + deltaY;

        // Prevent the button from exceeding the screen boundaries
        const clampedX = Math.min(
          Math.max(newX, padding), // No overflow on the left
          window.innerWidth - buttonSize - padding // No overflow on the right
        );
        const clampedY = Math.min(
          Math.max(newY, padding), // No overflow on the top
          window.innerHeight - buttonSize - padding // No overflow on the bottom
        );

        setPosition({ x: clampedX, y: clampedY });
      }
    }
  };

  // When the mouse is released, stop dragging, and determine if it's a click or drag
  const handleMouseUp = () => {
    if (!dragged) {
      // If no drag happened, consider it a click
      clickIcon();
    }
    setDragged(true);
    setIsDragging(false);
  };

  // Add mouse move and release event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startPosition, offset, dragged]);

  return (
    <>
      <FloatButton
        type="default"
        style={{
          left: position.x,
          top: position.y,
          position: 'fixed',
          height: buttonSize,
          width: buttonSize,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          cursor: isDragging ? 'grabbing' : 'pointer', // Change cursor style when dragging
        }}
        icon={<span className="float-btn-icon">{<FormOutlined />}</span>}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <Modal title="Content Modified" open={isModalOpen} footer={null} closable={false}>
        <Form
          form={form}
          layout="vertical"
          name="pr_form"
          initialValues={{
            title: PR_TITLE(filePath),
            content: PR_CONTENT(filePath),
          }}
        >
          <Form.Item name="title" label="PR Title" rules={[{ required: true, message: 'Please enter the PR title' }]}>
            <Input placeholder="Enter PR title" />
          </Form.Item>
          <Form.Item
            name="content"
            label="PR Content"
            rules={[{ required: true, message: 'Please enter the PR content' }]}
          >
            <Input.TextArea placeholder="Enter PR content" rows={4} />
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button onClick={handleCancel} style={{ marginRight: '8px' }}>
            Cancel
          </Button>
          <Button type="primary" onClick={submitPR}>
            Submit PR
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default View;
