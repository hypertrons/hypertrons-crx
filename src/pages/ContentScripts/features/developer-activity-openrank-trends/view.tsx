import React, { useState, useEffect } from 'react';
import getGithubTheme from '../../../../helpers/get-github-theme';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import Bars from '../../../../components/Bars';
import { UserMeta } from '../../../../api/common';
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
  activity: any;
  openrank: any;
  meta: UserMeta;
}

const View = ({ activity, openrank, meta }: Props): JSX.Element | null => {
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
  const BarsComponent = (
    <Bars
      theme={theme as 'light' | 'dark'}
      height={350}
      legend1={t('component_developerActORTrend_legend1')}
      legend2={t('component_developerActORTrend_legend2')}
      yName1={t('component_developerActORTrend_yName1')}
      yName2={t('component_developerActORTrend_yName2')}
      data1={barsData.data1}
      data2={barsData.data2}
    />
  );
  return isGithub() ? (
    <div className="border-top color-border-secondary pt-3 mt-3">
      <h2 className="h4 mb-3">{t('component_developerActORTrend_title')}</h2>
      {BarsComponent}
    </div>
  ) : (
    <div className="users__personal-groups" style={{ marginBottom: '0px' }}>
      <h3>{t('component_developerActORTrend_title')}</h3>
      <div className="ui middle aligned">{BarsComponent}</div>
    </div>
  );
};

export default View;
