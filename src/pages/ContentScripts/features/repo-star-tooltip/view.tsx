import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../../../utils/utils';
import Settings, { loadSettings } from '../../../../utils/settings';
import { generateDataByMonth } from '../../../../utils/data';
import ReactTooltip from 'react-tooltip';
import StarChart from './StarChart';

const githubTheme = getGithubTheme();

const View: React.FC<{
  stars: any;
}> = ({ stars: stars }) => {
  const [settings, setSettings] = useState(new Settings());

  useEffect(() => {
    (async () => {
      setSettings(await loadSettings());
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

export default View;
