// src/pages/Options/GitHubToken.tsx
import React, { useState, useEffect } from 'react';
import TooltipTrigger from '../../components/TooltipTrigger';
import { saveToken, getToken, githubRequest } from '../../api/githubApi'; // 引入保存和获取 token 的方法

const GitHubToken = () => {
  const [token, setToken] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSave = () => {
    if (!token) {
      console.error('Token 不能为空');
      return;
    }

    saveToken(token); // 保存 token
    alert('Token 已保存'); // 提示用户 token 已保存
  };

  const handleTestToken = async () => {
    try {
      const userData = await githubRequest('/user');
      alert(`Token 有效，用户名: ${userData.login}`);
    } catch (error) {
      console.error('Token 测试失败:', error);
      alert('Token 无效或请求失败');
    }
  };

  return (
    <div className="github-token-options Box">
      <div className="Box-header">
        <h2 className="Box-title">GitHub Token 配置</h2>
        <TooltipTrigger content="在此输入您的 GitHub Token 以便进行身份验证。" />
      </div>
      <p>提供 GitHub Token 可以确保 HyperCRX 安全、有效地访问和操作用户的 GitHub 数据并进行个性化分析。</p>
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <p>{'如何生成 GitHub Token？'}</p>
          <span style={{ marginLeft: '5px' }}>{isCollapsed ? '▶' : '▼'}</span>
        </div>
        {!isCollapsed && (
          <div className="instructions Box-body">
            <ul>
              <li>
                1. 登录 GitHub 并进入 <code>Settings</code>。
              </li>
              <li>
                2. 选择 <code>Developer settings</code>。
              </li>
              <li>
                3. 选择 <code>Personal access tokens</code>，点击 <code>Fine-grained tokens</code>，再点击{' '}
                <code>Generate a personal access token</code>。
              </li>
              <li>
                4. 设置 token 细节：
                <ul>
                  <li>
                    <strong>Note</strong>：描述性名称，如 "HyperCrx Token"。
                  </li>
                  <li>
                    <strong>Expiration</strong>：选择有效期。
                  </li>
                  <li>
                    <strong>Scopes</strong>：选择权限范围，如 <code>repo</code> 和 <code>workflow</code>。
                  </li>
                </ul>
              </li>
              <li>
                5. 点击 <code>Generate token</code> 按钮。
              </li>
              <li>6. 复制生成的 token 并粘贴到下面的输入框中。</li>
            </ul>
          </div>
        )}
      </div>
      <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="GitHub Token" />
      <button onClick={handleSave}>保存</button>
      <button onClick={handleTestToken} style={{ marginLeft: '10px' }}>
        测试 Token
      </button>
    </div>
  );
};

export default GitHubToken;
