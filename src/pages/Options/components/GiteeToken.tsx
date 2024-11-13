import React, { useState, useEffect, useRef } from 'react';
import TooltipTrigger from '../../../components/TooltipTrigger';
import { saveGiteeToken, getGiteeToken, giteeRequest } from '../../../api/giteeApi';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

const GiteeToken = () => {
  const [token, setToken] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchToken = async () => {
    const storedToken = await getGiteeToken();
    if (storedToken) {
      setToken(storedToken);
    }
  };
  useEffect(() => {
    fetchToken();
  }, []);

  const handleOAuthToken = async () => {
    const clientId = 'e76727820aa539f3a59399d0bc48156df2057e81774617e433eeb49d1dad97b3';
    const redirectUri = 'http://8.147.129.123/gitee';
    const scope = encodeURIComponent('user_info');
    const callback = chrome.identity.getRedirectURL();
    const authUrl = `https://gitee.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${callback}`;

    console.log('[FastPR]: Start authorization...');
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      async function (redirectUrl) {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error(chrome.runtime.lastError ? chrome.runtime.lastError.message : 'Authorization failed.');
          return;
        }
        const ret = new URL(redirectUrl).searchParams.get('ret');
        if (!ret) {
          console.error('Ret not returned in callback URL, check the server config');
          return;
        }
        const retData = JSON.parse(decodeURIComponent(ret));
        const userDataReq = await fetch(`https://gitee.com/api/v5/user`, {
          headers: { Authorization: `Bearer ${retData.access_token}` },
        });

        const userData = await userDataReq.json();

        if (userData === null || userData.message) {
          showMessage(t('gitee_token_error_invalid'), 'error');
        } else {
          console.log(`[FastPR]: Welcome: ${userData.login}`);
        }
      }
    );
  };

  const handleSave = () => {
    if (!token.trim()) {
      showMessage(t('gitee_token_error_empty'), 'error');
      return;
    }
    saveGiteeToken(token);
    showMessage(t('gitee_token_success_save'), 'success');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleTestToken = async () => {
    const userData = await giteeRequest('/user', {
      headers: { access_token: `Bearer ${token}` },
    });

    if (userData === null || userData.message) {
      showMessage(t('gitee_token_error_invalid'), 'error');
    } else {
      showMessage(t('gitee_token_success_valid', { username: userData.login }), 'success');
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
        <h2 className="Box-title">{t('gitee_token_configuration')}</h2>
        <TooltipTrigger content={t('gitee_token_tooltip')} />
      </div>
      <p>{t('gitee_token_description')}</p>
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <p>{t('gitee_token_how_to_generate')}</p>
          <span style={{ marginLeft: '5px' }}>{isCollapsed ? '▶' : '▼'}</span>
        </div>
        {!isCollapsed && (
          <div className="instructions Box-body">
            <ol>
              <li>{t('gitee_token_step1')}</li>
              <li>{t('gitee_token_step2')}</li>
              <li>{t('gitee_token_step3')}</li>
              <li>
                {t('gitee_token_step4')}
                <ul>
                  <li>
                    <strong>{t('gitee_token_note')}</strong>: {t('gitee_token_note_description')}
                  </li>
                  <li>
                    <strong>{t('gitee_token_scopes')}</strong>: {t('gitee_token_scopes_description')}
                  </li>
                </ul>
              </li>
              <li>{t('gitee_token_step5')}</li>
              <li>{t('gitee_token_step6')}</li>
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
          placeholder={t('gitee_token_placeholder')}
          style={{ marginRight: '10px', flex: 1 }}
          disabled={!isEditing}
        />
        {isEditing ? (
          <button onClick={handleSave} style={{ marginRight: '10px', marginTop: '17px' }}>
            {t('gitee_token_save')}
          </button>
        ) : (
          <button onClick={handleEdit} style={{ marginRight: '10px', marginTop: '17px' }}>
            {t('gitee_token_edit')}
          </button>
        )}
        <button onClick={handleTestToken} style={{ marginTop: '17px' }}>
          {t('gitee_token_test')}
        </button>
        <button onClick={handleOAuthToken} style={{ marginTop: '17px' }}>
          {'Start OAuth'}
        </button>
      </div>
    </div>
  );
};

export default GiteeToken;
