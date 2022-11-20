import React, { useState, useEffect } from 'react';
import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import { generateDataByMonth } from '../../utils/data';
import Settings, { loadSettings } from '../../utils/settings';
import { getActivity, getOpenrank } from '../../api/developer';
import Bars from '../../components/Bars/index';

const githubTheme = getGithubTheme();

interface DeveloperActORTrendViewProps {
  currentDeveloper: string;
}

const generateBarsData = (activity: any, openrank: any) => {
  return {
    data1: generateDataByMonth(activity),
    data2: generateDataByMonth(openrank),
  };
};

const DeveloperActORTrendView: React.FC<DeveloperActORTrendViewProps> = ({
  currentDeveloper,
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
      try {
        setActivity(await getActivity(currentDeveloper));
        setOpenrank(await getOpenrank(currentDeveloper));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!activity || !openrank) return null;

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

export default DeveloperActORTrendView;
