import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { getRepoActiInfl } from '../../api/repo';
import Bars from '../../components/Bars/index';

let githubTheme = getGithubTheme();
/*若是根据系统主题自动切换*/
if (githubTheme === 'auto') {
  /*判断是否处于深色模式*/
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    githubTheme = 'dark';
  } else {
    githubTheme = 'light';
  }
}

interface RepoActiInflTrendViewProps {
  currentRepo: string;
}

const RepoActiInflTrendView: React.FC<RepoActiInflTrendViewProps> = ({
  currentRepo,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [repoActiInflData, setRepoActiInflData] = useState();

  const generateBarsData = (repoActiInflData: any) => {
    const activityField = repoActiInflData['activity'];
    const influenceFiled = repoActiInflData['influence'];

    let data1: [string, number][] = [];
    let data2: [string, number][] = [];

    Object.keys(activityField).forEach((value, index) => {
      data1.push([value, activityField[value].toFixed(2)]);
      data2.push([value, influenceFiled[value].toFixed(2)]);
    });

    return { data1, data2 };
  };

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
    const getRepoActiInflData = async () => {
      try {
        const res = await getRepoActiInfl(currentRepo);
        setRepoActiInflData(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    getRepoActiInflData();
  }, []);

  if (!repoActiInflData) return null;

  let barsData: any = generateBarsData(repoActiInflData);

  return (
    <div>
      <h2 className="h4 mb-3">
        {getMessageByLocale(
          'component_repoActiInflTrend_title',
          settings.locale
        )}
      </h2>
      <Bars
        theme={githubTheme as 'light' | 'dark'}
        height={350}
        legend1={getMessageByLocale(
          'component_repoActiInflTrend_legend1',
          settings.locale
        )}
        legend2={getMessageByLocale(
          'component_repoActiInflTrend_legend2',
          settings.locale
        )}
        yName1={getMessageByLocale(
          'component_repoActiInflTrend_yName1',
          settings.locale
        )}
        yName2={getMessageByLocale(
          'component_repoActiInflTrend_yName2',
          settings.locale
        )}
        data1={barsData.data1}
        data2={barsData.data2}
      />
    </div>
  );
};

export default RepoActiInflTrendView;
