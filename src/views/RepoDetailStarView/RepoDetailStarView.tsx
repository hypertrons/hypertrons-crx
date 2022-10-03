import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { generateDataByMonth } from '../../utils/data';
import { getRepoDetail } from '../../api/repo';
import ReactTooltip from 'react-tooltip';
import StarBars from '../RepoDetailStarView/StarBars';

const githubTheme = getGithubTheme();

interface RepoDetailStarViewProps {
  currentRepo: string;
}

const generateStarBarsData = (star: any) => {
  return generateDataByMonth(star);
};

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
        setStar(res.data['s']);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!star) return null;

  return (
    <ReactTooltip
      id="star-tooltip"
      className={githubTheme === 'dark' ? 'custom-react-tooltip' : ''}
      clickable={true}
    >
      <StarBars width={300} height={150} data={generateStarBarsData(star)} />
    </ReactTooltip>
  );
};

export default RepoDetailStarView;
