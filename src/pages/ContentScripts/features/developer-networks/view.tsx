import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { iconDeveloperNetwork, iconRepoNetwork, iconInterestNetwork } from './icon-svg-path';
import './react-modal.scss';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import OSGraph from '../../../../components/OSGraph';
interface Props {
  userID: any;
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
  'https://osgraph.com/result?shareId=4&shareParams={paramId},10&isShare=true',
  'https://osgraph.com/result?shareId=5&shareParams={paramId},10&isShare=true',
  'https://osgraph.com/result?shareId=6&shareParams={paramId},5,3&isShare=true',
];

const osgraphLogo = 'https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*8rYtR4GWwe0AAAAAAAAAAAAADu3UAQ/original';
const View = ({ userID }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const [showOpenSourcePartnersNetwork, setShowOpenSourcePartnersNetwork] = useState(false);
  const [showDevelopmentActivityNetwork, setShowDevelopmentActivityNetwork] = useState(false);
  const [showOpenSourceInterestsNetwork, setShowOpenSourceInterestsNetwork] = useState(false);
  const { t, i18n } = useTranslation();
  const OSGraphUrls = baseOSGraphUrls.map(function (item) {
    return item.replace('{paramId}', userID);
  });
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, [options.locale]);

  return (
    <div className="border-top color-border-secondary pt-3 mt-3">
      <h2 className="h4 mb-2">Perceptor</h2>
      <ul className="vcard-details">
        <li className="vcard-detail pt-1">
          <svg
            className="octicon octicon-clock"
            viewBox="0 0 1024 1024"
            version="1.1"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path d={iconRepoNetwork}></path>
          </svg>
          <button
            style={{
              border: 0,
              padding: '1px 0',
              backgroundColor: 'transparent',
            }}
            onClick={() => {
              setShowDevelopmentActivityNetwork(true);
            }}
          >
            <span
              title={`${t('global_clickToshow')} ${t('component_developmentActivityNetwork_title')}`}
              className="Label"
              style={{
                color: 'var(--color-fg-default)',
                fontWeight: 'var(--base-text-weight-normal, 400)',
              }}
            >
              {t('component_developmentActivityNetwork_title')}
            </span>
          </button>
        </li>
        <li className="vcard-detail pt-1">
          <svg
            className="octicon octicon-clock"
            viewBox="0 0 1024 1024"
            version="1.1"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path d={iconDeveloperNetwork}></path>
          </svg>
          <button
            style={{
              border: 0,
              padding: '1px 0',
              backgroundColor: 'transparent',
            }}
            onClick={() => {
              setShowOpenSourcePartnersNetwork(true);
            }}
          >
            <span
              title={`${t('global_clickToshow')} ${t('component_openSourcePartnersNetwork_title')}`}
              className="Label"
              style={{
                color: 'var(--color-fg-default)',
                fontWeight: 'var(--base-text-weight-normal, 400)',
              }}
            >
              {t('component_openSourcePartnersNetwork_title')}
            </span>
          </button>
        </li>
        <li className="vcard-detail pt-1">
          <svg
            className="octicon octicon-clock"
            viewBox="0 0 1024 1024"
            version="1.1"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path d={iconInterestNetwork}></path>
          </svg>
          <button
            style={{
              border: 0,
              padding: '1px 0',
              backgroundColor: 'transparent',
            }}
            onClick={() => {
              setShowOpenSourceInterestsNetwork(true);
            }}
          >
            <span
              title={`${t('global_clickToshow')} ${t('component_openSourceInterestsNetwork_title')}`}
              className="Label"
              style={{
                color: 'var(--color-fg-default)',
                fontWeight: 'var(--base-text-weight-normal, 400)',
              }}
            >
              {t('component_openSourceInterestsNetwork_title')}
            </span>
          </button>
        </li>
      </ul>
      <ReactModal
        className="ReactModal__Content_Custom"
        overlayClassName="ReactModal__Overlay_Custom"
        parentSelector={() => document.querySelector('main') ?? document.body}
        isOpen={showDevelopmentActivityNetwork}
        onRequestClose={() => {
          setShowDevelopmentActivityNetwork(false);
        }}
        ariaHideApp={false}
      >
        <div>
          <div className="hypertrons-crx-title">
            <span>{t('component_developmentActivityNetwork_title')}</span>
            <div style={logoStyle}>
              <a href={OSGraphUrls[0]} target="_blank">
                <img src={osgraphLogo}></img>
              </a>
            </div>
          </div>
          <div className="d-flex flex-wrap flex-items-center justify-content-lg-between align-items-center">
            <div className="col-8 graph-container">
              <div style={{ margin: '15px 0 20px 0px' }}>
                <OSGraph shareId={3} style={OSGraphStyle} OSGraphUrl={OSGraphUrls[0]} />
              </div>
            </div>
            <div className="col-4 description-container">
              <div className="color-text-secondary developer-tab">
                <p>{t('component_developmentActivityNetwork_description')}</p>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
      <ReactModal
        className="ReactModal__Content_Custom"
        overlayClassName="ReactModal__Overlay_Custom"
        parentSelector={() => document.querySelector('main') ?? document.body}
        isOpen={showOpenSourcePartnersNetwork}
        onRequestClose={() => {
          setShowOpenSourcePartnersNetwork(false);
        }}
        ariaHideApp={false}
      >
        <div>
          <div className="hypertrons-crx-title">
            <span>{t('component_openSourcePartnersNetwork_title')}</span>
            <div style={logoStyle}>
              <a href={OSGraphUrls[1]} target="_blank">
                <img src={osgraphLogo}></img>
              </a>
            </div>
          </div>
          <div className="d-flex flex-wrap flex-items-center justify-content-lg-between align-items-center">
            <div className="col-lg-8 col-12 graph-container">
              <div style={{ margin: '15px 0px 20px 0px' }}>
                <OSGraph shareId={4} style={OSGraphStyle} OSGraphUrl={OSGraphUrls[1]} />
              </div>
            </div>
            <div className="col-lg-4 col-12 description-container">
              <div className="color-text-secondary">
                <p>{t('component_openSourcePartnersNetwork_description')}</p>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
      <ReactModal
        className="ReactModal__Content_Custom"
        overlayClassName="ReactModal__Overlay_Custom"
        parentSelector={() => document.querySelector('main') ?? document.body}
        isOpen={showOpenSourceInterestsNetwork}
        onRequestClose={() => {
          setShowOpenSourceInterestsNetwork(false);
        }}
        ariaHideApp={false}
      >
        <div>
          <div className="hypertrons-crx-title">
            <span>{t('component_openSourceInterestsNetwork_title')}</span>
            <div style={logoStyle}>
              <a href={OSGraphUrls[2]} target="_blank">
                <img src={osgraphLogo}></img>
              </a>
            </div>
          </div>
          <div className="d-flex flex-wrap flex-items-center justify-content-lg-between align-items-center">
            <div className="col-lg-8 col-12 graph-container">
              <div style={{ margin: '15px 0px 20px 0px' }}>
                <OSGraph shareId={5} style={OSGraphStyle} OSGraphUrl={OSGraphUrls[2]} />
              </div>
            </div>
            <div className="col-lg-4 col-12 description-container">
              <div className="color-text-secondary">
                <p>{t('component_openSourceInterestsNetwork_description')}</p>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default View;
