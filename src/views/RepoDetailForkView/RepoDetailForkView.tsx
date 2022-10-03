import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { generateDataByMonth } from '../../utils/data';
import { getRepoDetail } from '../../api/repo';
import ReactTooltip from 'react-tooltip';
import ForkBars from './ForkBars';

const githubTheme = getGithubTheme();

interface RepoDetailForkViewProps {
  currentRepo: string;
}

const generateForkBarsData = (fork: any) => {
  return generateDataByMonth(fork);
};

const RepoDetailForkView: React.FC<RepoDetailForkViewProps> = ({
  currentRepo,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [fork, setFork] = useState();

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
      try {
        const res = await getRepoDetail(currentRepo);
        setFork(res.data['f']);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!fork) return null;

  return (
    <ReactTooltip
      id="fork-tooltip"
      className={githubTheme === 'dark' ? 'custom-react-tooltip' : ''}
      clickable={true}
    >
      <ForkBars width={300} height={150} data={generateForkBarsData(fork)} />
    </ReactTooltip>
  );
};

export default RepoDetailForkView;
