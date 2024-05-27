import React, { useState, useEffect } from 'react';

import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import getGithubTheme from '../../../../helpers/get-github-theme';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import StarChart from './StarChart';
import { RepoMeta } from '../../../../api/common';
import TooltipTrigger from '../../../../components/TooltipTrigger';

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
    <>
      <div
        className="chart-title"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: '5px' }}>
          {getMessageByLocale('star_popup_title', options.locale)}
        </div>

        <TooltipTrigger
          iconColor="000000"
          size={13}
          content={getMessageByLocale('star_icon', options.locale)}
        />
      </div>

      <StarChart
        theme={githubTheme as 'light' | 'dark'}
        width={270}
        height={130}
        data={generateDataByMonth(stars, meta.updatedAt)}
      />
    </>
  );
};

export default View;
