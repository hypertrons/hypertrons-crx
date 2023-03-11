import React, { useState, useEffect } from 'react';

import {
  getGithubTheme,
  getMessageByLocale,
  isNull,
  isAllNull,
} from '../../../../utils/utils';
import Settings, { loadSettings } from '../../../../utils/settings';
import { generateDataByMonth } from '../../../../utils/data';
import ReactTooltip from 'react-tooltip';
import IssueChart from './IssueChart';

const githubTheme = getGithubTheme();

export interface IssueDetail {
  issuesOpened: any;
  issuesClosed: any;
  issueComments: any;
}

interface Props {
  currentRepo: string;
  issueDetail: IssueDetail;
}

const generateData = (issueDetail: IssueDetail): any => {
  return {
    issuesOpened: generateDataByMonth(issueDetail.issuesOpened),
    issuesClosed: generateDataByMonth(issueDetail.issuesClosed),
    issueComments: generateDataByMonth(issueDetail.issueComments),
  };
};

const RepoDetailIssueView = ({
  currentRepo,
  issueDetail,
}: Props): JSX.Element | null => {
  const [settings, setSettings] = useState(new Settings());

  useEffect(() => {
    (async () => {
      setSettings(await loadSettings());
    })();
  }, []);

  if (isNull(issueDetail) || isAllNull(issueDetail)) return null;

  const onClick = (curMonth: string, params: any) => {
    const seriesIndex = params.seriesIndex;
    let type;
    if (seriesIndex === 0) {
      type = 'created';
    } else if (seriesIndex === 1) {
      type = 'closed';
    } else if (seriesIndex === 2) {
      type = 'updated';
    }
    let [year, month] = curMonth.toString().split(',')[0].split('-');
    if (month.length < 2) {
      month = '0' + month;
    }
    window.open(
      `/${currentRepo}/issues?q=is:issue ${type}:${year}-${month} sort:updated-asc`
    );
  };

  return (
    <ReactTooltip id="issue-tooltip" clickable={true}>
      <div className="chart-title">
        {getMessageByLocale('issue_popup_title', settings.locale)}
      </div>
      <IssueChart
        theme={githubTheme as 'light' | 'dark'}
        width={300}
        height={200}
        data={generateData(issueDetail)}
        onClick={onClick}
      />
    </ReactTooltip>
  );
};

export default RepoDetailIssueView;
