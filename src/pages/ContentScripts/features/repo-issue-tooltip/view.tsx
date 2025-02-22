import React, { useState, useEffect } from 'react';

import getGithubTheme from '../../../../helpers/get-github-theme';
import { isNull, isAllNull } from '../../../../helpers/is-null';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import IssueChart from './IssueChart';
import { RepoMeta } from '../../../../api/common';
import TooltipTrigger from '../../../../components/TooltipTrigger';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import isGithub from '../../../../helpers/is-github';
const theme = isGithub() ? getGithubTheme() : 'light';

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

const View = ({ currentRepo, issueDetail, meta }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  if (isNull(issueDetail) || isAllNull(issueDetail)) return null;

  const onClick = (curMonth: string, params: any) => {
    if (!isGithub()) return;
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
    window.open(`/${currentRepo}/issues?q=is:issue ${type}:${year}-${month} sort:updated-asc`);
  };

  return (
    <>
      <div
        className="chart-title"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: '5px' }}>{t('issue_popup_title')}</div>

        <TooltipTrigger iconColor="grey" size={13} content={t('icon_tip', { icon_content: '$t(issue_icon)' })} />
      </div>

      <IssueChart
        theme={theme as 'light' | 'dark'}
        width={300}
        height={200}
        data={generateData(issueDetail, meta.updatedAt)}
        onClick={onClick}
      />
    </>
  );
};

export default View;
