import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import { generateDataByMonth } from '../../utils/data';
import Settings, { loadSettings } from '../../utils/settings';
import { getActivity, getOpenrank } from '../../api/repo';
import Bars from '../../components/Bars/index';

const githubTheme = getGithubTheme();

interface RepoActORTrendViewProps {
  currentRepo: string;
}

const generateBarsData = (activity: any, openrank: any) => {
  return {
    data1: generateDataByMonth(activity),
    data2: generateDataByMonth(openrank),
  };
};

const RepoActORTrendView: React.FC<RepoActORTrendViewProps> = ({
  currentRepo,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [activity, setActivity] = useState();
  const [openrank, setOpenrank] = useState();

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    };
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  useEffect(() => {
    (async () => {
      setActivity(await getActivity(currentRepo));
      setOpenrank(await getOpenrank(currentRepo));
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
        `/${currentRepo}/issues?q=updated:${year}-${month} sort:updated-asc`
      );
    }
  };

  return (
    <div>
      <h2 className="h4 mb-3">
        {getMessageByLocale('component_repoActORTrend_title', settings.locale)}
      </h2>
      <Bars
        theme={githubTheme as 'light' | 'dark'}
        height={350}
        legend1={getMessageByLocale(
          'component_repoActORTrend_legend1',
          settings.locale
        )}
        legend2={getMessageByLocale(
          'component_repoActORTrend_legend2',
          settings.locale
        )}
        yName1={getMessageByLocale(
          'component_repoActORTrend_yName1',
          settings.locale
        )}
        yName2={getMessageByLocale(
          'component_repoActORTrend_yName2',
          settings.locale
        )}
        data1={barsData.data1}
        data2={barsData.data2}
        onClick={onClick}
      />
    </div>
  );
};

export default RepoActORTrendView;
