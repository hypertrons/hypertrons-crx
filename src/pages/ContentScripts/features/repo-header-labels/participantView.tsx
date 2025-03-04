import getGithubTheme from '../../../../helpers/get-github-theme';
import { isNull } from '../../../../helpers/is-null';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import ParticipantChart from './ParticipantChart';
import ContributorChart from './ContributorChart';
import { RepoMeta } from '../../../../api/common';
import React, { useState, useEffect } from 'react';
import TooltipTrigger from '../../../../components/TooltipTrigger';

import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import isGithub from '../../../../helpers/is-github';
const theme = isGithub() ? getGithubTheme() : 'light';

interface Props {
  participant: any;
  contributor: any;
  meta: RepoMeta;
}

const ParticipantView = ({ participant, contributor, meta }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  if (isNull(participant) || isNull(contributor)) return null;

  const participantData = generateDataByMonth(participant, meta.updatedAt);
  const contributorData = generateDataByMonth(contributor, meta.updatedAt);

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
        <div style={{ marginRight: '5px' }}>{t('header_label_contributor')}</div>
        <TooltipTrigger
          iconColor="grey"
          size={13}
          content={t('icon_tip', { icon_content: '$t(contributors_participants_icon)' })}
        />
      </div>
      <ContributorChart theme={theme as 'light' | 'dark'} width={270} height={130} data={contributorData} />
      <div
        className="chart-title"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: '5px' }}>{t('header_label_participant')}</div>
        <TooltipTrigger
          iconColor="grey"
          size={13}
          content={t('icon_tip', { icon_content: '$t(contributors_participants_icon)' })}
        />
      </div>
      <ParticipantChart theme={theme as 'light' | 'dark'} width={270} height={130} data={participantData} />
    </>
  );
};

export default ParticipantView;
