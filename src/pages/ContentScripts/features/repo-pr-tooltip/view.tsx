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
import PRChart from './PRChart';
import MergedLinesChart from './MergedLinesChart';

const githubTheme = getGithubTheme();

export interface PRDetail {
  PROpened: any;
  PRMerged: any;
  PRReviews: any;
  mergedCodeAddition: any;
  mergedCodeDeletion: any;
}

interface Props {
  currentRepo: string;
  PRDetail: PRDetail;
}

const generatePRChartData = (PRDetail: PRDetail): any => {
  return {
    PROpened: generateDataByMonth(PRDetail.PROpened),
    PRMerged: generateDataByMonth(PRDetail.PRMerged),
    PRReviews: generateDataByMonth(PRDetail.PRReviews),
  };
};

const generateMergedLinesChartData = (PRDetail: PRDetail): any => {
  return {
    mergedCodeAddition: generateDataByMonth(PRDetail.mergedCodeAddition),
    mergedCodeDeletion: generateDataByMonth(PRDetail.mergedCodeDeletion).map(
      (item) => {
        const dataItem = item;
        dataItem[1] = -item[1];
        return dataItem;
      }
    ),
  };
};

const View = ({ currentRepo, PRDetail }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  if (isNull(PRDetail) || isAllNull(PRDetail)) return null;

  const onClick = (curMonth: string, params: any) => {
    const seriesIndex = params.seriesIndex;
    let type;
    if (seriesIndex === 0) {
      type = 'created';
    } else if (seriesIndex === 1) {
      type = 'merged';
    } else if (seriesIndex === 2) {
      type = 'updated';
    }
    let [year, month] = curMonth.toString().split(',')[0].split('-');
    if (month.length < 2) {
      month = '0' + month;
    }
    window.open(
      `/${currentRepo}/pulls?q=is:pr ${type}:${year}-${month} sort:updated-asc`
    );
  };

  return (
    <ReactTooltip id="pr-tooltip" clickable={true}>
      <div className="chart-title">
        {getMessageByLocale('pr_popup_title', options.locale)}
      </div>
      <PRChart
        theme={githubTheme as 'light' | 'dark'}
        width={330}
        height={200}
        data={generatePRChartData(PRDetail)}
        onClick={onClick}
      />
      <div className="chart-title">
        {getMessageByLocale('merged_lines_popup_title', options.locale)}
      </div>
      <MergedLinesChart
        theme={githubTheme as 'light' | 'dark'}
        width={330}
        height={200}
        data={generateMergedLinesChartData(PRDetail)}
      />
    </ReactTooltip>
  );
};

export default View;
