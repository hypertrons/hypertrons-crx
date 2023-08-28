import React, { useState, useEffect } from 'react';

import getGithubTheme from '../../../../helpers/get-github-theme';
import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import { isNull, isAllNull } from '../../../../helpers/is-null';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import ReactTooltip from 'react-tooltip';
import IssueChart from './IssueChart';
import { RepoMeta } from '../../../../api/common';

const githubTheme = getGithubTheme();

export interface IssueDetail {
  issuesOpened: any;
  issuesClosed: any;
  issueComments: any;
}

interface Props {
  currentRepo: string;
  issueDetail: IssueDetail;
  meta: RepoMeta;
}

const generateData = (issueDetail: IssueDetail, updatedAt: number): any => {
  return {
    issuesOpened: generateDataByMonth(issueDetail.issuesOpened, updatedAt),
    issuesClosed: generateDataByMonth(issueDetail.issuesClosed, updatedAt),
    issueComments: generateDataByMonth(issueDetail.issueComments, updatedAt),
  };
};

const View = ({
  currentRepo,
  issueDetail,
  meta,
}: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
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
        {getMessageByLocale('issue_popup_title', options.locale)}
      </div>
      <IssueChart
        theme={githubTheme as 'light' | 'dark'}
        width={300}
        height={200}
        data={generateData(issueDetail, meta.updatedAt)}
        onClick={onClick}
      />
    </ReactTooltip>
  );
};

export default View;
