import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { runsWhen, getMessageByLocale } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import Settings, { loadSettings } from '../../utils/settings';
import { utils } from 'github-url-detection';
import { getDeveloperActiInfl } from '../../api/developer';
import Bars from '../../components/Bars/index';

interface DeveloperActiInflTrendViewProps {
  currentDeveloper: string;
}

const DeveloperActiInflTrendView: React.FC<DeveloperActiInflTrendViewProps> = ({
  currentDeveloper,
}) => {
  const [developerActiInflData, setDeveloperActiInflData] = useState();

  const generateBarsData = (developerActiInflData: any) => {
    const activityField = developerActiInflData['activity'];
    const influenceFiled = developerActiInflData['influence'];

    let xAxisData: string[] = [];
    let data1: number[] = [];
    let data2: number[] = [];

    Object.keys(activityField).forEach((value, index) => {
      xAxisData.push(`${value.substr(2, 2)}/${value.split('-')[1]}`);
      data1.push(activityField[value].toFixed(2));
      data2.push(influenceFiled[value].toFixed(2));
    });

    return { xAxisData, data1, data2 };
  };

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
      <h2 className="h4 mb-3">Activity & Influence Trends</h2>
      <Bars
        theme="light"
        height={350}
        xAxisData={barsData.xAxisData}
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
    const profileArea = $('.js-profile-editable-area').parent();
    const newContainer = document.createElement('div');
    newContainer.id = 'developer-acti-infl-trend';
    newContainer.style.width = '100%';
    this._currentDeveloper = $('.p-nickname.vcard-username.d-block')
      .text()
      .trim();
    const settings = await loadSettings();
    render(
      <DeveloperActiInflTrendView currentDeveloper={this._currentDeveloper}/>,
      newContainer
    );
    profileArea.after(newContainer);
  }
}

inject2Perceptor(DeveloperActiInflTrend);
