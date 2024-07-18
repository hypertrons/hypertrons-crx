import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import getGithubTheme from '../../../../helpers/get-github-theme';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import { rocketLight, rocketDark } from './base64';

interface OpenRankProps {
  developerName: string;
  openrank: string;
}

const OpenRankView: React.FC<OpenRankProps> = ({ developerName, openrank }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getGithubTheme() as 'light' | 'dark');
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = getGithubTheme() as 'light' | 'dark';
      setTheme(newTheme);
    };

    // Listen for theme change events
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  return (
    <div className={`openrank-info-container ${theme}`} data-developer-name={developerName}>
      <div className="openrank-info" style={{ color: theme === 'light' ? 'black' : 'white' }}>
        <img
          width={20}
          height={20}
          style={{ display: 'inline-block', verticalAlign: 'middle', position: 'relative', left: '-2.5px' }}
          src={theme === 'light' ? rocketLight : rocketDark}
          alt=""
        />
        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>OpenRank {openrank}</span>
      </div>
    </div>
  );
};

export const renderOpenRank = (container: HTMLElement, developerName: string, openrank: string) => {
  const openRankContainer = document.createElement('div');
  container.appendChild(openRankContainer);
  ReactDOM.render(<OpenRankView developerName={developerName} openrank={openrank} />, openRankContainer);
};
