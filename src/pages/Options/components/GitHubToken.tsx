import React, { useState, useEffect, useRef } from 'react';
import TooltipTrigger from '../../../components/TooltipTrigger';
import { saveGithubToken, getGithubToken, githubRequest } from '../../../api/githubApi';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { removeGithubToken } from '../../../helpers/github-token';

const GitHubToken = () => {
  const [inputValue, setInputValue] = useState('');
  const { t, i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchToken = async () => {
    const storedToken = await getGithubToken();
    if (storedToken) {
      updateInputValue();
    }
  };

  const updateInputValue = async () => {
    const userData = await githubRequest('/user');
    if (userData && userData.login) {
      setInputValue(t('github_account_binded', { username: userData.login }));
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    fetchToken();
  }, [i18n.language]);

  const handleBindAccount = async () => {
    const clientId = 'Ov23liyofMsuQYwtfGLb';
    const redirectUri = 'https://oauth.hypercrx.cn/github';
    const callback = chrome.identity.getRedirectURL();
    const scope = encodeURIComponent('read:user, public_repo');
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&state=${callback}`;

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      async (redirectUrl) => {
        if (!redirectUrl) {
          console.error(chrome.runtime.lastError ? chrome.runtime.lastError.message : 'Authorization failed.');
          return;
        }
        const ret = new URL(redirectUrl).searchParams.get('ret');
        if (!ret) {
          console.error('Ret not returned in callback URL, check the server config');
          return;
        }
        const retData = JSON.parse(decodeURIComponent(ret));
        if (!retData.access_token) {
          console.error('Invalid token data returned, check the server config');
          showMessage(t('github_account_bind_fail'), 'error');
          return;
        }
        await saveGithubToken(retData.access_token);
        updateInputValue();
      }
    );
  };

  const handleUnbindAccount = async () => {
    await removeGithubToken();
    setInputValue('');
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
        <h2 className="Box-title">{t('github_account_configuration')}</h2>
        <TooltipTrigger overlayClassName="custom-tooltip-option" content={t('github_account_tooltip')} />
      </div>
      <p>{t('github_account_description')}</p>
      <div style={{ marginBottom: '10px' }} id="message-container"></div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          placeholder={t('github_account_no_bind')}
          style={{ marginRight: '10px', flex: 1 }}
          disabled={true}
        />
        <button onClick={handleBindAccount}>{t('github_account_bind')}</button>
        <button onClick={handleUnbindAccount} style={{ marginLeft: '10px' }}>
          {t('github_account_unbind')}
        </button>
      </div>
    </div>
  );
};

export default GitHubToken;
