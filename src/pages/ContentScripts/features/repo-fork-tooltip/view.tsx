import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../../../utils/utils';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import { generateDataByMonth } from '../../../../utils/data';
import ReactTooltip from 'react-tooltip';
import ForkChart from './ForkChart';

const githubTheme = getGithubTheme();

interface Props {
  forks: any;
}

const View = ({ forks }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  if (!forks) return null;

  return (
    <ReactTooltip id="fork-tooltip" clickable={true}>
      <div className="chart-title">
        {getMessageByLocale('fork_popup_title', options.locale)}
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
