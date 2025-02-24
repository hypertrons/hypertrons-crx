import React, { useState, useEffect } from 'react';
import getGithubTheme from '../../../../helpers/get-github-theme';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import Bars from '../../../../components/Bars';
import { RepoMeta } from '../../../../api/common';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import isGithub from '../../../../helpers/is-github';
const theme = isGithub() ? getGithubTheme() : 'light';

const generateBarsData = (activity: any, openrank: any, updatedAt: number) => {
  return {
    data1: generateDataByMonth(activity, updatedAt),
    data2: generateDataByMonth(openrank, updatedAt),
  };
};

interface Props {
  repoName: string;
  activity: any;
  openrank: any;
  meta: RepoMeta;
}

const View = ({ repoName, activity, openrank, meta }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  if (!activity || !openrank) return null;

  let barsData: any = generateBarsData(activity, openrank, meta.updatedAt);

  const onClick = (params: any) => {
    const { seriesIndex, data } = params;
    if (seriesIndex === 0) {
      let [year, month] = data.toString().split(',')[0].split('-');
      if (month.length < 2) {
        month = '0' + month;
      }

      window.open(`/${repoName}/issues?q=updated:${year}-${month} sort:updated-asc`);
    }
  };
  const BarsComponent = (
    <Bars
      theme={theme as 'light' | 'dark'}
      height={350}
      legend1={t('component_repoActORTrend_legend1')}
      legend2={t('component_repoActORTrend_legend2')}
      yName1={t('component_repoActORTrend_yName1')}
      yName2={t('component_repoActORTrend_yName2')}
      data1={barsData.data1}
      data2={barsData.data2}
      onClick={onClick}
    />
  );
  return isGithub() ? (
    <div>
      <h2 className="h4 mb-3">{t('component_repoActORTrend_title')}</h2>
      {BarsComponent}
    </div>
  ) : (
    <div>
      <div className="header">{t('component_repoActORTrend_title')}</div>
      <div className="content" id="repo-activity-racing-bar">
        {BarsComponent}
      </div>
    </div>
  );
};

export default View;
