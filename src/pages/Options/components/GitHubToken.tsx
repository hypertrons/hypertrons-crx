import React, { useState, useEffect, useRef } from 'react';
import TooltipTrigger from '../../../components/TooltipTrigger';
import { saveToken, getToken, githubRequest } from '../../../api/githubApi';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

const GitHubToken = () => {
  const [token, setToken] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSave = () => {
    if (!token.trim()) {
      showMessage(t('github_token_error_empty'), 'error');
      return;
    }
    saveToken(token);
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
    <div className="github-token-options Box">
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
      </div>
    </div>
  );
};

export default GitHubToken;
