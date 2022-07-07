import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import {
  getGithubTheme,
  runsWhen,
  getMessageByLocale,
} from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import Settings, { loadSettings } from '../../utils/settings';
import { getDeveloperActiInfl } from '../../api/developer';
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

interface DeveloperActiInflTrendViewProps {
  currentDeveloper: string;
}

const DeveloperActiInflTrendView: React.FC<DeveloperActiInflTrendViewProps> = ({
  currentDeveloper,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [developerActiInflData, setDeveloperActiInflData] = useState();

  const generateBarsData = (developerActiInflData: any) => {
    const activityField = developerActiInflData['activity'];
    const influenceFiled = developerActiInflData['influence'];

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
    const getDeveloperActiInflData = async () => {
      try {
        const res = await getDeveloperActiInfl(currentDeveloper);
        setDeveloperActiInflData(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    getDeveloperActiInflData();
  }, []);

  if (!developerActiInflData) return null;

  let barsData: any = generateBarsData(developerActiInflData);
  return (
    <div className="border-top color-border-secondary pt-3 mt-3">
      <h2 className="h4 mb-3">
        {getMessageByLocale(
          'component_developerActiInflTrend_title',
          settings.locale
        )}
      </h2>
      <Bars
        theme={githubTheme as 'light' | 'dark'}
        height={350}
        legend1={getMessageByLocale(
          'component_developerActiInflTrend_legend1',
          settings.locale
        )}
        legend2={getMessageByLocale(
          'component_developerActiInflTrend_legend2',
          settings.locale
        )}
        yName1={getMessageByLocale(
          'component_developerActiInflTrend_yName1',
          settings.locale
        )}
        yName2={getMessageByLocale(
          'component_developerActiInflTrend_yName2',
          settings.locale
        )}
        data1={barsData.data1}
        data2={barsData.data2}
      />
    </div>
  );
};

@runsWhen([pageDetect.isUserProfile])
class DeveloperActiInflTrend extends PerceptorBase {
  private _currentDeveloper: string;

  constructor() {
    super();
    this._currentDeveloper = '';
  }

  public async run(): Promise<void> {
    this._currentDeveloper = $('.p-nickname.vcard-username.d-block')
      .text()
      .trim();

    let profileArea = null;
    let newContainer = null;

    // if exists (when going backword or forward in browser history)
    if (document.getElementById('developer-acti-infl-trend') != null) {
      render(
        <DeveloperActiInflTrendView
          currentDeveloper={this._currentDeveloper}
        />,
        document.getElementById('developer-acti-infl-trend')
      );
    } else {
      profileArea = $('.js-profile-editable-area').parent();
      newContainer = document.createElement('div');
      newContainer.id = 'developer-acti-infl-trend';
      newContainer.style.width = '100%';

      render(
        <DeveloperActiInflTrendView
          currentDeveloper={this._currentDeveloper}
        />,
        newContainer
      );
      profileArea.after(newContainer);
    }
  }
}

export default DeveloperActiInflTrend;
