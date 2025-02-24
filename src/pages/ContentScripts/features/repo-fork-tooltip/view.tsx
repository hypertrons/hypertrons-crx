import React, { useState, useEffect } from 'react';
import getGithubTheme from '../../../../helpers/get-github-theme';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import ForkChart from './ForkChart';
import { RepoMeta } from '../../../../api/common';
import TooltipTrigger from '../../../../components/TooltipTrigger';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import isGithub from '../../../../helpers/is-github';
const theme = isGithub() ? getGithubTheme() : 'light';

interface Props {
  forks: any;
  meta: RepoMeta;
}

const View = ({ forks, meta }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  if (!forks) return null;

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
        <div style={{ marginRight: '5px' }}>{t('fork_popup_title')}</div>

        <TooltipTrigger iconColor="grey" size={13} content={t('icon_tip', { icon_content: '$t(fork_icon)' })} />
      </div>

      <ForkChart
        theme={theme as 'light' | 'dark'}
        width={270}
        height={130}
        data={generateDataByMonth(forks, meta.updatedAt)}
      />
    </>
  );
};

export default View;
