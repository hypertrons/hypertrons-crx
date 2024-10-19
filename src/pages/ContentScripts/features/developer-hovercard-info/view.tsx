import React from 'react';
import getGithubTheme from '../../../../helpers/get-github-theme';
import '../../../../helpers/i18n';

interface OpenRankProps {
  developerName: string;
  openrank: string;
}

const View: React.FC<OpenRankProps> = ({ developerName, openrank }) => {
  const theme = getGithubTheme() as 'light' | 'dark';

  const textColor = theme === 'light' ? '#636c76' : '#8d96a0';
  const fontSize = '12px';
  const rocketLightLogo = chrome.runtime.getURL('rocketLightLogo.png');
  const rocketDarkLogo = chrome.runtime.getURL('rocketDarkLogo.png');

  return (
    <div className={`hypercrx-openrank-info ${theme}`} data-developer-name={developerName}>
      <div className="openrank-info">
        <img
          width={20}
          height={20}
          style={{ display: 'inline-block', verticalAlign: 'middle', position: 'relative', left: '-2.5px' }}
          src={theme === 'light' ? rocketLightLogo : rocketDarkLogo}
          alt=""
        />
        <span
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            lineHeight: '1.25 !important ',
            color: textColor,
            fontSize: fontSize,
          }}
        >
          OpenRank {openrank}
        </span>
      </div>
    </div>
  );
};

export default View;
