import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../../../utils/utils';
import { defaultSettings, loadSettings } from '../../../../utils/settings';
import { generateDataByMonth } from '../../../../utils/data';
import ReactTooltip from 'react-tooltip';
import StarChart from './StarChart';

const githubTheme = getGithubTheme();

interface Props {
  stars: any;
}

const View = ({ stars: stars }: Props): JSX.Element | null => {
  const [settings, setSettings] = useState(defaultSettings);

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
