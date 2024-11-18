import React, { useState, useEffect, useRef } from 'react';
import TooltipTrigger from '../../../components/TooltipTrigger';
import { saveGiteeToken, getGiteeToken, giteeRequest } from '../../../api/giteeApi';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { removeGiteeToken } from '../../../helpers/gitee-token';

const GiteeToken = () => {
  const [inputValue, setInputValue] = useState('');
  const { t, i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchToken = async () => {
    const storedToken = await getGiteeToken();
    if (storedToken) {
      updateInputValue();
    }
  };

  const updateInputValue = async () => {
    const userData = await giteeRequest('user');
    if (userData && userData.login) {
      setInputValue(t('gitee_account_binded', { username: userData.login }));
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    fetchToken();
  }, [i18n.language]);

  const handleBindAccount = async () => {
    const clientId = 'e76727820aa539f3a59399d0bc48156df2057e81774617e433eeb49d1dad97b3';
    const redirectUri = 'https://oauth.hypercrx.cn/gitee';
    const scope = encodeURIComponent('user_info projects pull_requests issues notes');
    const callback = chrome.identity.getRedirectURL();
    const authUrl = `https://gitee.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${callback}`;

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      async function (redirectUrl) {
        if (!redirectUrl) {
          console.error(chrome.runtime.lastError ? chrome.runtime.lastError.message : 'Authorization failed.');
          return;
        }
        const ret = new URL(redirectUrl).searchParams.get('ret');
        if (!ret) {
          console.error('Ret not returned in callback URL, check the server config');
          showMessage(t('gitee_account_bind_fail'), 'error');
          return;
        }
        const retData = JSON.parse(decodeURIComponent(ret));
        if (!retData.access_token || !retData.refresh_token || !retData.expires_in) {
          console.error('Invalid token data returned, check the server config');
          showMessage(t('gitee_account_bind_fail'), 'error');
          return;
        }
        const expireAt = Date.now() + (retData.expires_in - 120) * 1000;
        await saveGiteeToken(retData.access_token, expireAt, retData.refresh_token);
        updateInputValue();
      }
    );
  };

  const handleUnbindAccount = async () => {
    await removeGiteeToken();
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
        <h2 className="Box-title">{t('gitee_account_configuration')}</h2>
        <TooltipTrigger overlayClassName="custom-tooltip-option" content={t('gitee_account_tooltip')} />
      </div>
      <p>{t('gitee_account_description')}</p>
      <div style={{ marginBottom: '10px' }} id="message-container"></div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          placeholder={t('gitee_account_no_bind')}
          style={{ marginRight: '10px', flex: 1 }}
          disabled={true}
        />
        <button onClick={handleBindAccount}>{t('gitee_account_bind')}</button>
        <button onClick={handleUnbindAccount} style={{ marginLeft: '10px' }}>
          {t('gitee_account_unbind')}
        </button>
      </div>
    </div>
  );
};

export default GiteeToken;
