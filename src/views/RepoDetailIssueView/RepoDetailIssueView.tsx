import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { generateDataByMonth } from '../../utils/data';
import {
  getIssuesOpened,
  getIssuesClosed,
  getIssueComments,
} from '../../api/repo';
import ReactTooltip from 'react-tooltip';
import IssueChart from './IssueChart';

const githubTheme = getGithubTheme();

interface RepoDetailIssueViewProps {
  currentRepo: string;
}

const generateIssueData = (issue: any): any => {
  return {
    issuesOpened: generateDataByMonth(issue.issuesOpened),
    issuesClosed: generateDataByMonth(issue.issuesClosed),
    issueComments: generateDataByMonth(issue.issueComments),
  };
};

const RepoDetailIssueView: React.FC<RepoDetailIssueViewProps> = ({
  currentRepo,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [issue, setIssue] = useState<any>();

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
        setIssue({
          issuesOpened: await getIssuesOpened(currentRepo),
          issuesClosed: await getIssuesClosed(currentRepo),
          issueComments: await getIssueComments(currentRepo),
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!issue) return null;

  const onClick = (params: any) => {
    console.log(params);
    const series = params[0];
    const ym = series.data[0];
    let [year, month] = ym.toString().split(',')[0].split('-');
    if (month.length < 2) {
      month = '0' + month;
    }

    window.open(
      `/${currentRepo}/issues?q=is:issue creatd:${year}-${month} sort:updated-asc`
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
        data={generateIssueData(issue)}
        onClick={onClick}
      />
    </ReactTooltip>
  );
};

export default RepoDetailIssueView;
