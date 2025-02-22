import React, { useState, useEffect } from 'react';
import getGithubTheme from '../../../../helpers/get-github-theme';
import { isNull, isAllNull } from '../../../../helpers/is-null';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import PRChart from './PRChart';
import MergedLinesChart from './MergedLinesChart';
import { RepoMeta } from '../../../../api/common';
import TooltipTrigger from '../../../../components/TooltipTrigger';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import isGithub from '../../../../helpers/is-github';
const theme = isGithub() ? getGithubTheme() : 'light';
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
  meta: RepoMeta;
}

const generatePRChartData = (PRDetail: PRDetail, updatedAt: number): any => {
  return {
    PROpened: generateDataByMonth(PRDetail.PROpened, updatedAt),
    PRMerged: generateDataByMonth(PRDetail.PRMerged, updatedAt),
    PRReviews: generateDataByMonth(PRDetail.PRReviews, updatedAt),
  };
};

const generateMergedLinesChartData = (PRDetail: PRDetail, updatedAt: number): any => {
  return {
    mergedCodeAddition: generateDataByMonth(PRDetail.mergedCodeAddition, updatedAt),
    mergedCodeDeletion: generateDataByMonth(PRDetail.mergedCodeDeletion, updatedAt).map((item) => {
      const dataItem = item;
      dataItem[1] = -item[1];
      return dataItem;
    }),
  };
};

const View = ({ currentRepo, PRDetail, meta }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  if (isNull(PRDetail) || isAllNull(PRDetail)) return null;

  const onClick = (curMonth: string, params: any) => {
    if (!isGithub()) return;
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
    window.open(`/${currentRepo}/pulls?q=is:pr ${type}:${year}-${month} sort:updated-asc`);
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
        <div style={{ marginRight: '5px' }}>{t('pr_popup_title')}</div>
        <TooltipTrigger iconColor="grey" size={13} content={t('icon_tip', { icon_content: '$t(pr_icon)' })} />
      </div>

      <PRChart
        theme={theme as 'light' | 'dark'}
        width={330}
        height={200}
        data={generatePRChartData(PRDetail, meta.updatedAt)}
        onClick={onClick}
      />

      {PRDetail.mergedCodeAddition && PRDetail.mergedCodeDeletion && (
        <>
          <div
            className="chart-title"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ marginRight: '5px' }}>{t('merged_lines_popup_title')}</div>
            <TooltipTrigger
              iconColor="grey"
              size={13}
              content={t('icon_tip', { icon_content: '$t(merged_lines_icon)' })}
            />
          </div>

          <MergedLinesChart
            theme={theme as 'light' | 'dark'}
            width={330}
            height={200}
            data={generateMergedLinesChartData(PRDetail, meta.updatedAt)}
          />
        </>
      )}
    </>
  );
};

export default View;
