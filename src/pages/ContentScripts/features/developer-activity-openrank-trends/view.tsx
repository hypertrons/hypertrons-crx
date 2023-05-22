import React, { useState, useEffect } from 'react';

import getGithubTheme from '../../../../helpers/get-github-theme';
import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import Bars from '../../../../components/Bars';

const githubTheme = getGithubTheme();

const generateBarsData = (activity: any, openrank: any) => {
  return {
    data1: generateDataByMonth(activity),
    data2: generateDataByMonth(openrank),
  };
};

interface Props {
  activity: any;
  openrank: any;
}

const View = ({ activity, openrank }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  if (!activity || !openrank) return null;

  let barsData: any = generateBarsData(activity, openrank);

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
