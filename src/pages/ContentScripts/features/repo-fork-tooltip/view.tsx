import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../../../utils/utils';
import Settings, { loadSettings } from '../../../../utils/settings';
import { generateDataByMonth } from '../../../../utils/data';
import ReactTooltip from 'react-tooltip';
import ForkChart from './ForkChart';

const githubTheme = getGithubTheme();

interface RepoDetailForkViewProps {
  forks: any;
}

const View: React.FC<RepoDetailForkViewProps> = ({ forks }) => {
  const [settings, setSettings] = useState(new Settings());

  useEffect(() => {
    (async () => {
      setSettings(await loadSettings());
    })();
  }, []);

  if (!forks) return null;

  return (
    <ReactTooltip id="fork-tooltip" clickable={true}>
      <div className="chart-title">
        {getMessageByLocale('fork_popup_title', settings.locale)}
      </div>
      <ForkChart
        theme={githubTheme as 'light' | 'dark'}
        width={270}
        height={130}
        data={generateDataByMonth(forks)}
      />
    </ReactTooltip>
  );
};

export default View;
