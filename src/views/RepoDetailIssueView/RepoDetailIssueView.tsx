import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { generateDataByMonth } from '../../utils/data';
import { getRepoDetail } from '../../api/repo';
import ReactTooltip from 'react-tooltip';
import IssueChart from './IssueChart';

const githubTheme = getGithubTheme();

interface RepoDetailIssueViewProps {
  currentRepo: string;
}

const generateIssueData = (issue: any): any => {
  return {
    ic: generateDataByMonth(issue.ic),
    oi: generateDataByMonth(issue.oi),
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
        const res = await getRepoDetail(currentRepo);
        setIssue({
          ic: res.data['ic'],
          oi: res.data['oi'],
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!issue) return null;

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
      />
    </ReactTooltip>
  );
};

export default RepoDetailIssueView;
