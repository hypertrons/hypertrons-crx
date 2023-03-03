import React, { useState, useEffect } from 'react';
import { getGithubTheme, getMessageByLocale } from '../../../../utils/utils';
import { generateDataByMonth } from '../../../../utils/data';
import Settings, { loadSettings } from '../../../../utils/settings';
import { getActivity, getOpenrank } from '../../../../api/developer';
import Bars from '../../../../components/Bars/index';

const githubTheme = getGithubTheme();

const generateBarsData = (activity: any, openrank: any) => {
  return {
    data1: generateDataByMonth(activity),
    data2: generateDataByMonth(openrank),
  };
};

const View: React.FC<{
  developerName: string;
  activity: any;
  openrank: any;
}> = ({ developerName: developerName, activity, openrank }) => {
  const [settings, setSettings] = useState(new Settings());

  useEffect(() => {
    (async () => {
      openrank;
    })();
  }, []);

  if (!settings || !activity || !openrank) return null;

  let barsData: any = generateBarsData(activity, openrank);
  return (
    <div className="border-top color-border-secondary pt-3 mt-3">
      <h2 className="h4 mb-3">
        {getMessageByLocale(
          'component_developerActORTrend_title',
          settings.locale
        )}
      </h2>
      <Bars
        theme={githubTheme as 'light' | 'dark'}
        height={350}
        legend1={getMessageByLocale(
          'component_developerActORTrend_legend1',
          settings.locale
        )}
        legend2={getMessageByLocale(
          'component_developerActORTrend_legend2',
          settings.locale
        )}
        yName1={getMessageByLocale(
          'component_developerActORTrend_yName1',
          settings.locale
        )}
        yName2={getMessageByLocale(
          'component_developerActORTrend_yName2',
          settings.locale
        )}
        data1={barsData.data1}
        data2={barsData.data2}
      />
    </div>
  );
};

export default View;
