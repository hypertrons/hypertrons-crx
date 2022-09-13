import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { getRepoDetail } from '../../api/repo';
import ReactTooltip from 'react-tooltip';

const githubTheme = getGithubTheme();

interface RepoDetailForkViewProps {
  currentRepo: string;
}

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
    <ReactTooltip id="fork-tooltip" clickable={true}>
      <p>This is a global react component tooltip</p>
      <p>You can put every thing here</p>
      <ul>
        <li>Word</li>
        <li>Chart</li>
        <li>Else</li>
      </ul>
    </ReactTooltip>
  );
};

export default RepoDetailForkView;
