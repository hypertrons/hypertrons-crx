import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { generateDataByMonth } from '../../utils/data';
import { getForks } from '../../api/repo';
import ReactTooltip from 'react-tooltip';
import ForkChart from './ForkChart';

const githubTheme = getGithubTheme();

interface RepoDetailForkViewProps {
  currentRepo: string;
}

const RepoDetailForkView: React.FC<RepoDetailForkViewProps> = ({
  currentRepo,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [forks, setForks] = useState();

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    };
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  useEffect(() => {
    (async () => {
      setForks(await getForks(currentRepo));
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

export default RepoDetailForkView;
