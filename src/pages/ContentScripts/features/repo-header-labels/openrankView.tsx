import getGithubTheme from '../../../../helpers/get-github-theme';
import { isNull } from '../../../../helpers/is-null';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import OpenRankChart from './OpenRankChart';
import { RepoMeta } from '../../../../api/common';
import React, { useState, useEffect } from 'react';
import TooltipTrigger from '../../../../components/TooltipTrigger';

import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import isGithub from '../../../../helpers/is-github';
const theme = isGithub() ? getGithubTheme() : 'light';

interface Props {
  openrank: any;
  meta: RepoMeta;
}

const OpenrankView = ({ openrank, meta }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  if (isNull(openrank)) return null;

  const openrankData = generateDataByMonth(openrank, meta.updatedAt);
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
        <div style={{ marginRight: '5px' }}>{t('header_label_OpenRank')}</div>
        <TooltipTrigger iconColor="grey" size={13} content={t('icon_tip', { icon_content: '$t(openrank_icon)' })} />
      </div>
      <OpenRankChart theme={theme as 'light' | 'dark'} width={270} height={130} data={openrankData} />
    </>
  );
};

export default OpenrankView;
