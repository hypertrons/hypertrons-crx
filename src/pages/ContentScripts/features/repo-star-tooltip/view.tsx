import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../../../utils/utils';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import { generateDataByMonth } from '../../../../utils/data';
import ReactTooltip from 'react-tooltip';
import StarChart from './StarChart';

const githubTheme = getGithubTheme();

interface Props {
  stars: any;
}

const View = ({ stars: stars }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  if (!stars) return null;

  return (
    <ReactTooltip id="star-tooltip" clickable={true}>
      <div className="chart-title">
        {getMessageByLocale('star_popup_title', options.locale)}
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
