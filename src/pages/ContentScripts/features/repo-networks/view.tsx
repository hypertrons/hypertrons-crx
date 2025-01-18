import React, { useState, useEffect } from 'react';

import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import OSGraph from '../../../../components/OSGraph';

interface Props {
  repoName: string;
}
const OSGraphStyle = {
  width: '100%',
  height: '400px',
  border: 'none',
  marginTop: '5px',
};

const logoStyle = {
  cssFloat: 'right',
  marginRight: '50px',
  marginTop: '5px',
};

const baseOSGraphUrls = {
  projectContributionNetwork:
    'https://osgraph.com/graphs/project-contribution/github/{repoName}?lang={lang}&repo-limit=10',
  projectEcosystemNetwork: 'https://osgraph.com/graphs/project-ecosystem/github/{repoName}?lang={lang}&repo-limit=10',
  projectCommunityNetwork:
    'https://osgraph.com/graphs/project-community/github/{repoName}?lang={lang}&country-limit=5&company-limit=5&user-limit=3',
};
const View = ({ repoName }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  const OSGraphUrls = Object.fromEntries(
    Object.entries(baseOSGraphUrls).map(([key, url]) => [
      key,
      url.replace('{repoName}', repoName).replace('{lang}', i18n.language == 'en' ? 'en-US' : 'zh-CN'),
    ])
  );
  const osGraphLogo = chrome.runtime.getURL('osGraphLogo.png');
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{t('component_projectContributionNetwork_title')}</span>
          <div style={logoStyle}>
            <a href={OSGraphUrls.projectContributionNetwork} target="_blank">
              <img src={osGraphLogo} width={28} height={28}></img>
            </a>
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <OSGraph shareId={0} style={OSGraphStyle} OSGraphUrl={OSGraphUrls.projectContributionNetwork} />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="color-text-secondary" style={{ marginLeft: '35px', marginRight: '35px' }}>
              <p>{t('component_projectContributionNetwork_description')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{t('component_projectEcosystemNetwork_title')}</span>
          <div style={logoStyle}>
            <a href={OSGraphUrls.projectEcosystemNetwork} target="_blank">
              <img src={osGraphLogo} width={28} height={28}></img>
            </a>
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <OSGraph shareId={1} style={OSGraphStyle} OSGraphUrl={OSGraphUrls.projectEcosystemNetwork} />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="color-text-secondary" style={{ marginLeft: '35px', marginRight: '35px' }}>
              <p>{t('component_projectEcosystemNetwork_description')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{t('component_projectCommunityNetwork_title')}</span>
          <div style={logoStyle}>
            <a href={OSGraphUrls.projectCommunityNetwork} target="_blank">
              <img src={osGraphLogo} width={28} height={28}></img>
            </a>
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <OSGraph shareId={2} style={OSGraphStyle} OSGraphUrl={OSGraphUrls.projectCommunityNetwork} />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="color-text-secondary" style={{ marginLeft: '35px', marginRight: '35px' }}>
              <p>{t('component_projectCommunityNetwork_description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
