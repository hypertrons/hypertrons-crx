import React, { useState, useEffect } from 'react';

import getGithubTheme from '../../../../helpers/get-github-theme';
import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import Bars from '../../../../components/Bars';
import { UserMeta } from '../../../../api/common';

const githubTheme = getGithubTheme();

const generateBarsData = (activity: any, openrank: any, updatedAt: number) => {
  return {
    data1: generateDataByMonth(activity, updatedAt),
    data2: generateDataByMonth(openrank, updatedAt),
  };
};

interface Props {
  activity: any;
  openrank: any;
  meta: UserMeta;
}

const View = ({ activity, openrank, meta }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  if (!activity || !openrank) return null;

  let barsData: any = generateBarsData(activity, openrank, meta.updatedAt);

  return (
    <div className="border-top color-border-secondary pt-3 mt-3">
      <h2 className="h4 mb-3">
        {getMessageByLocale(
          'component_developerActORTrend_title',
          options.locale
        )}
      </h2>
      <Bars
        theme={githubTheme as 'light' | 'dark'}
        height={350}
        legend1={getMessageByLocale(
          'component_developerActORTrend_legend1',
          options.locale
        )}
        legend2={getMessageByLocale(
          'component_developerActORTrend_legend2',
          options.locale
        )}
        yName1={getMessageByLocale(
          'component_developerActORTrend_yName1',
          options.locale
        )}
        yName2={getMessageByLocale(
          'component_developerActORTrend_yName2',
          options.locale
        )}
        data1={barsData.data1}
        data2={barsData.data2}
      />
    </div>
  );
};

export default View;
