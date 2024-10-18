import React, { useState, useEffect } from 'react';

import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import OSGraph from '../../../../components/OSGraph';

interface Props {
  repoID: any;
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
const baseOSGraphUrls = [
  'https://osgraph.com/result?shareId=1&shareParams={paramId},1405669423,1721288623,10&isShare=true',
  'https://osgraph.com/result?shareId=2&shareParams={paramId},10&isShare=true',
  'https://osgraph.com/result?shareId=3&shareParams={paramId},5,5,3&isShare=true',
];
const View = ({ repoID }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  const OSGraphUrls = baseOSGraphUrls.map(function (item) {
    return item.replace('{paramId}', repoID);
  });

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
            <a href={OSGraphUrls[0]} target="_blank">
              <img src={chrome.runtime.getURL('osGraphLogo.png')} width={28} height={28}></img>
            </a>
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <OSGraph shareId={0} style={OSGraphStyle} OSGraphUrl={OSGraphUrls[0]} />
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
            <a href={OSGraphUrls[1]} target="_blank">
              <img src={chrome.runtime.getURL('osGraphLogo.png')} width={28} height={28}></img>
            </a>
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <OSGraph shareId={1} style={OSGraphStyle} OSGraphUrl={OSGraphUrls[1]} />
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
            <a href={OSGraphUrls[2]} target="_blank">
              <img src={chrome.runtime.getURL('osGraphLogo.png')} width={28} height={28}></img>
            </a>
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <OSGraph shareId={2} style={OSGraphStyle} OSGraphUrl={OSGraphUrls[2]} />
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
