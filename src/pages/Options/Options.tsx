import React, { useState, useEffect } from 'react';
import { Checkbox, Radio, Space, Row, Col } from 'antd';
import { importedFeatures } from '../../../README.md';
import optionsStorage, { HypercrxOptions } from '../../options-storage';
import { HYPERCRX_GITHUB } from '../../constant';
import TooltipTrigger from '../../components/TooltipTrigger';
import { useTranslation } from 'react-i18next';
import '../../helpers/i18n';
import GitHubToken from './components/GitHubToken';
import GiteeToken from './components/GiteeToken';

const stacksStyleOptions = {
  headerStack: {
    paddingBottom: '10px',
  },
  mainStack: {
    marginBottom: '40px',
  },
  settingStack: {
    margin: '10px 25px',
  },
  tokenStack: {
    margin: '10px 25px',
  },
};

const Options = (): JSX.Element => {
  const [version, setVersion] = useState<string>();
  const [options, setOptions] = useState<HypercrxOptions>();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setVersion((await chrome.management.getSelf()).version);
      setOptions(await optionsStorage.getAll());
    })();
  }, []);
  if (!version || !options) {
    return <div />;
  }

  function buildFeatureCheckbox(name: FeatureName, isEnabled: boolean) {
    return (
      <Col span={24}>
        <Checkbox
          key={name}
          defaultChecked={isEnabled}
          onChange={async (e) => {
            await optionsStorage.set({
              [`hypercrx-${name}`]: e.target.checked,
            });
            setOptions(await optionsStorage.getAll());
          }}
        >
          {name}
        </Checkbox>
      </Col>
    );
  }

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Row justify="center">
          <Space direction="vertical" style={{ textAlign: 'center' }}>
            <h1>HyperCRX</h1>
            <sub>{`version ${version}`}</sub>
          </Space>
        </Row>

        <Row justify="center" style={stacksStyleOptions.mainStack} gutter={[30, 30]}>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="Box">
              <div className="Box-header">
                <h2 className="Box-title">{t('options_locale_title')}</h2>
                <TooltipTrigger overlayClassName="custom-tooltip-option" content={t('options_locale_toolTip')} />
              </div>
              <div style={stacksStyleOptions.settingStack}>
                <p>{t('options_locale_toolTip')} :</p>
                <Radio.Group
                  defaultValue={options.locale}
                  onChange={async (e) => {
                    await optionsStorage.set({ locale: e.target.value });
                    i18n.changeLanguage(e.target.value);
                    setOptions(await optionsStorage.getAll());
                  }}
                >
                  <Space direction="vertical">
                    <Radio value={'en'}>English</Radio>
                    <Radio value={'zh_CN'}>简体中文 (Simplified Chinese)</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </Col>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="Box">
              <div className="Box-header">
                <h2 className="Box-title">{t('options_components_title')}</h2>
                <TooltipTrigger overlayClassName="custom-tooltip-option" content={t('options_components_toolTip')} />
              </div>
              <Row style={stacksStyleOptions.settingStack} gutter={[16, 10]}>
                <p>{t('options_components_toolTip')} :</p>

                {importedFeatures.map((name: FeatureName) => {
                  return buildFeatureCheckbox(name, options[`hypercrx-${name}`]);
                })}
              </Row>
            </div>
          </Col>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: stacksStyleOptions.tokenStack.margin,
            }}
          >
            <GitHubToken /> {/* Add GitHubToken component */}
          </Col>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: stacksStyleOptions.tokenStack.margin,
            }}
          >
            <GiteeToken /> {/* Add GiteeToken component */}
          </Col>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="Box">
              <div className="Box-header">
                <h2 className="Box-title">{t('options_about_title')}</h2>
                <TooltipTrigger overlayClassName="custom-tooltip-option" content={t('options_about_toolTip')} />
              </div>
              <div style={stacksStyleOptions.settingStack}>
                <p>{t('options_about_description')}</p>
                <p>
                  GitHub:{' '}
                  <a href={HYPERCRX_GITHUB} target="_blank">
                    {HYPERCRX_GITHUB}
                  </a>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Options;
