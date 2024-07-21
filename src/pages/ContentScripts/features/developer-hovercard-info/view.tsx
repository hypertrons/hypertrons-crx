import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import getGithubTheme from '../../../../helpers/get-github-theme';
import '../../../../helpers/i18n';
import { rocketLight, rocketDark } from './base64';

interface OpenRankProps {
  developerName: string;
  openrank: string;
}

const View: React.FC<OpenRankProps> = ({ developerName, openrank }) => {
  const theme = getGithubTheme() as 'light' | 'dark';

  const textColor = theme === 'light' ? '#717981' : '#878f98';
  const fontSize = '13px';

  return (
    <div className={`openrank-info-container ${theme}`} data-developer-name={developerName}>
      <div className="openrank-info">
        <img
          width={20}
          height={20}
          style={{ display: 'inline-block', verticalAlign: 'middle', position: 'relative', left: '-2.5px' }}
          src={theme === 'light' ? rocketLight : rocketDark}
          alt=""
        />
        <span style={{ display: 'inline-block', verticalAlign: 'middle', color: textColor, fontSize: fontSize }}>
          OpenRank {openrank}
        </span>
      </div>
    </div>
  );
};

export default View;
