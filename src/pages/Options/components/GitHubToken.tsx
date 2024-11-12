import React, { useState, useEffect, useRef } from 'react';
import TooltipTrigger from '../../../components/TooltipTrigger';
import { saveGithubToken, getGithubToken, githubRequest } from '../../../api/githubApi';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

const GitHubToken = () => {
  const [token, setToken] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchToken = async () => {
    const storedToken = await getGithubToken();
    if (storedToken) {
      setToken(storedToken);
    }
  };
  useEffect(() => {
    fetchToken();
  }, []);

  const handleOAuthToken = async () => {
    const clientId = 'Ov23liyofMsuQYwtfGLb';
    const redirectUri = chrome.identity.getRedirectURL();
    const scope = encodeURIComponent('read:user');
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;

    console.log('[FastPR]: Start authorization...');
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      function (redirectUrl) {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error(chrome.runtime.lastError ? chrome.runtime.lastError.message : 'Authorization failed.');
          return;
        }
        const code = new URL(redirectUrl).searchParams.get('code');
        console.log('[FastPR]: Get session code:', code?.slice(0, 2).padEnd(code.length - 2, '*'));
        fetch('http://8.147.129.123/github', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ code }),
        }).then(async (response) => {
          if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
          }
          const respData = await response.json();
          const token = respData.access_token;

          const userDataReq = await fetch(`https://api.github.com/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const userData = await userDataReq.json();
          if (userData === null || userData.message) {
            showMessage(t('github_token_error_invalid'), 'error');
          } else {
            console.log(`[FastPR]: Welcome: ${userData.login}`);
          }
        });
      }
    );
  };

  const handleSave = () => {
    if (!token.trim()) {
      showMessage(t('github_token_error_empty'), 'error');
      return;
    }
    saveGithubToken(token);
    showMessage(t('github_token_success_save'), 'success');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleTestToken = async () => {
    const userData = await githubRequest('/user', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (userData === null || userData.message) {
      showMessage(t('github_token_error_invalid'), 'error');
    } else {
      showMessage(t('github_token_success_valid', { username: userData.login }), 'success');
    }
  };

  const obfuscateToken = (token: string): string => {
    if (token.length <= 4) return token;
    return `${token[0]}${'*'.repeat(token.length - 2)}${token[token.length - 1]}`;
  };

  const showMessage = (content: string, type: 'success' | 'error') => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      message.config({
        top: rect.top - 50,
        duration: 2,
        maxCount: 3,
      });
      message[type](content);
    }
  };

  return (
    <div className="token-options Box">
      <div className="Box-header">
        <h2 className="Box-title">{t('github_token_configuration')}</h2>
        <TooltipTrigger content={t('github_token_tooltip')} />
      </div>
      <p>{t('github_token_description')}</p>
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <p>{t('github_token_how_to_generate')}</p>
          <span style={{ marginLeft: '5px' }}>{isCollapsed ? '▶' : '▼'}</span>
        </div>
        {!isCollapsed && (
          <div className="instructions Box-body">
            <ol>
              <li>{t('github_token_step1')}</li>
              <li>{t('github_token_step2')}</li>
              <li>{t('github_token_step3')}</li>
              <li>
                {t('github_token_step4')}
                <ul>
                  <li>
                    <strong>{t('github_token_note')}</strong>: {t('github_token_note_description')}
                  </li>
                  <li>
                    <strong>{t('github_token_expiration')}</strong>: {t('github_token_expiration_description')}
                  </li>
                  <li>
                    <strong>{t('github_token_scopes')}</strong>: {t('github_token_scopes_description')}
                  </li>
                </ul>
              </li>
              <li>{t('github_token_step5')}</li>
              <li>{t('github_token_step6')}</li>
            </ol>
          </div>
        )}
      </div>
      <div style={{ marginBottom: '10px' }} id="message-container"></div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          ref={inputRef}
          value={isEditing ? token : obfuscateToken(token)}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t('github_token_placeholder')}
          style={{ marginRight: '10px', flex: 1 }}
          disabled={!isEditing}
        />
        {isEditing ? (
          <button onClick={handleSave} style={{ marginRight: '10px', marginTop: '17px' }}>
            {t('github_token_save')}
          </button>
        ) : (
          <button onClick={handleEdit} style={{ marginRight: '10px', marginTop: '17px' }}>
            {t('github_token_edit')}
          </button>
        )}
        <button onClick={handleTestToken} style={{ marginTop: '17px' }}>
          {t('github_token_test')}
        </button>
        <button onClick={handleOAuthToken} style={{ marginTop: '17px' }}>
          {'Start OAuth'}
        </button>
      </div>
    </div>
  );
};

export default GitHubToken;
