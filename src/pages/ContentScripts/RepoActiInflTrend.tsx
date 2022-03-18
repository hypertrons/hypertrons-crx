import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { runsWhen, getMessageByLocale } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import Settings, { loadSettings } from '../../utils/settings';
import { utils } from 'github-url-detection';
import { getRepoActiInfl } from '../../api/repo';
import Bars from '../../components/Bars/index';

interface RepoActiInflTrendViewProps {
  currentRepo: string;
}

const RepoActiInflTrendView: React.FC<RepoActiInflTrendViewProps> = ({
  currentRepo,
}) => {
  const [repoActiInflData, setRepoActiInflData] = useState();

  const generateBarsData = (repoActiInflData: any) => {
    const activityField = repoActiInflData['activity'];
    const influenceFiled = repoActiInflData['influence'];

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

@runsWhen([pageDetect.isRepo])
class RepoActiInflTrend extends PerceptorBase {
  private _currentRepo: string;

  constructor() {
    super();
    this._currentRepo = '';
  }
  public async run(): Promise<void> {
    if (document.getElementById('repo-acti-infl-trend') != null) return;

    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;
    const settings = await loadSettings();

    const newBorderGridRow = document.createElement('div');
    newBorderGridRow.id = 'repo-acti-infl-trend';
    newBorderGridRow.className = 'BorderGrid-row';
    const newBorderGridCell = document.createElement('div');
    newBorderGridCell.className = 'BorderGrid-cell';
    newBorderGridRow.appendChild(newBorderGridCell);

    render(
      <RepoActiInflTrendView currentRepo={this._currentRepo} />,
      newBorderGridCell
    );

    const borderGridRows = $('div.Layout-sidebar').children('.BorderGrid');
    borderGridRows.append(newBorderGridRow);
  }
}

inject2Perceptor(RepoActiInflTrend);
