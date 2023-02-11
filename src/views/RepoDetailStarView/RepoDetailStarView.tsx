import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { generateDataByMonth } from '../../utils/data';
import { getStars } from '../../api/repo';
import ReactTooltip from 'react-tooltip';
import StarChart from './StarChart';

const githubTheme = getGithubTheme();

interface RepoDetailStarViewProps {
  currentRepo: string;
}

const RepoDetailStarView: React.FC<RepoDetailStarViewProps> = ({
  currentRepo,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [stars, setStars] = useState();

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
      setStars(await getStars(currentRepo));
    })();
  }, []);

  if (!stars) return null;

  return (
    <ReactTooltip id="star-tooltip" clickable={true}>
      <div className="chart-title">
        {getMessageByLocale('star_popup_title', settings.locale)}
      </div>
      <StarChart
        theme={githubTheme as 'light' | 'dark'}
        width={270}
        height={130}
        data={generateDataByMonth(stars)}
      />
    </ReactTooltip>
  );
};

export default RepoDetailStarView;
