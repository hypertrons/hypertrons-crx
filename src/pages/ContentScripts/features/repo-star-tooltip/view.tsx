import React, { useState, useEffect } from 'react';

import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import getGithubTheme from '../../../../helpers/get-github-theme';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import ReactTooltip from 'react-tooltip';
import StarChart from './StarChart';
import { RepoMeta } from '../../../../api/common';

const githubTheme = getGithubTheme();

interface Props {
  stars: any;
  meta: RepoMeta;
}

const View = ({ stars, meta }: Props): JSX.Element | null => {
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
        data={generateDataByMonth(stars, meta.updatedAt)}
      />
    </ReactTooltip>
  );
};

export default View;
