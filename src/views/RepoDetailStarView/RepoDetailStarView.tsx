import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { getRepoDetail } from '../../api/repo';
import ReactTooltip from 'react-tooltip';

const githubTheme = getGithubTheme();

interface RepoDetailStarViewProps {
  currentRepo: string;
}

const RepoDetailStarView: React.FC<RepoDetailStarViewProps> = ({
  currentRepo,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [star, setStar] = useState();

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
        setStar(res.data['f']);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!star) return null;

  return (
    <ReactTooltip id="star-tooltip" clickable={true}>
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

export default RepoDetailStarView;
