import React, { useState, useEffect } from 'react';

import { getGithubTheme } from '../../../../helpers/get-github-theme';
import { getMessageByLocale } from '../../../../helpers/get-message';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import Bars from '../../../../components/Bars/index';

const githubTheme = getGithubTheme();

const generateBarsData = (activity: any, openrank: any) => {
  return {
    data1: generateDataByMonth(activity),
    data2: generateDataByMonth(openrank),
  };
};

interface Props {
  repoName: string;
  activity: any;
  openrank: any;
}

const View = ({ repoName, activity, openrank }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  if (!activity || !openrank) return null;

  let barsData: any = generateBarsData(activity, openrank);

  const onClick = (params: any) => {
    const { seriesIndex, data } = params;
    if (seriesIndex === 0) {
      let [year, month] = data.toString().split(',')[0].split('-');
      if (month.length < 2) {
        month = '0' + month;
      }

      window.open(
        `/${repoName}/issues?q=updated:${year}-${month} sort:updated-asc`
      );
    }
  };

  return (
    <div>
      <h2 className="h4 mb-3">
        {getMessageByLocale('component_repoActORTrend_title', options.locale)}
      </h2>
      <Bars
        theme={githubTheme as 'light' | 'dark'}
        height={350}
        legend1={getMessageByLocale(
          'component_repoActORTrend_legend1',
          options.locale
        )}
        legend2={getMessageByLocale(
          'component_repoActORTrend_legend2',
          options.locale
        )}
        yName1={getMessageByLocale(
          'component_repoActORTrend_yName1',
          options.locale
        )}
        yName2={getMessageByLocale(
          'component_repoActORTrend_yName2',
          options.locale
        )}
        data1={barsData.data1}
        data2={barsData.data2}
        onClick={onClick}
      />
    </div>
  );
};

export default View;
