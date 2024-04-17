import React, { useState, useEffect } from 'react';
import { Stack, ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react';
import { Checkbox } from 'antd';

import { importedFeatures } from '../../../README.md';
import optionsStorage, { HypercrxOptions } from '../../options-storage';
import getMessageByLocale from '../../helpers/get-message-by-locale';
import { HYPERCRX_GITHUB } from '../../constant';
import TooltipTrigger from '../../components/TooltipTrigger';
import './Options.css';

const localeOptions: IChoiceGroupOption[] = [
  {
    key: 'en',
    text: 'English',
  },
  {
    key: 'zh_CN',
    text: '简体中文 (Simplified Chinese)',
  },
];

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
};

const Options = (): JSX.Element => {
  const [version, setVersion] = useState<string>();
  const [options, setOptions] = useState<HypercrxOptions>();

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
      <Checkbox
        key={name}
        defaultChecked={isEnabled}
        onChange={async (e) => {
          await optionsStorage.set({ [`hypercrx-${name}`]: e.target.checked });
          setOptions(await optionsStorage.getAll());
        }}
      >
        {name}
      </Checkbox>
    );
  }

  return (
    <Stack>
      <Stack horizontalAlign="center" style={stacksStyleOptions.headerStack}>
        <h1>Hypercrx</h1>
        <sub>{`version ${version}`}</sub>
      </Stack>
      <Stack
        horizontalAlign="center"
        style={stacksStyleOptions.mainStack}
        tokens={{
          childrenGap: 30,
        }}
      >
        <Stack.Item className="Box">
          <Stack.Item className="Box-header">
            <h2 className="Box-title">
              {getMessageByLocale('options_locale_title', options.locale)}
            </h2>
            <TooltipTrigger
              content={getMessageByLocale(
                'options_locale_toolTip',
                options.locale
              )}
            />
          </Stack.Item>
          <Stack style={stacksStyleOptions.settingStack}>
            <p>
              {getMessageByLocale('options_locale_toolTip', options.locale)} :
            </p>
            <ChoiceGroup
              defaultSelectedKey={options.locale}
              options={localeOptions}
              onChange={async (e, option: any) => {
                await optionsStorage.set({ locale: option.key });
                setOptions(await optionsStorage.getAll());
              }}
            />
          </Stack>
        </Stack.Item>
        <Stack.Item className="Box">
          <Stack.Item className="Box-header">
            <h2 className="Box-title">
              {getMessageByLocale('options_components_title', options.locale)}
            </h2>
            <TooltipTrigger
              content={getMessageByLocale(
                'options_components_toolTip',
                options.locale
              )}
            />
          </Stack.Item>
          <Stack
            style={stacksStyleOptions.settingStack}
            tokens={{
              childrenGap: 10,
            }}
          >
            <p>
              {getMessageByLocale('options_components_toolTip', options.locale)}{' '}
              :
            </p>
            {importedFeatures.map((name: FeatureName) => {
              return buildFeatureCheckbox(name, options[`hypercrx-${name}`]);
            })}
          </Stack>
        </Stack.Item>
        <Stack.Item className="Box">
          <Stack.Item className="Box-header">
            <h2 className="Box-title">
              {getMessageByLocale('options_about_title', options.locale)}
            </h2>
            <TooltipTrigger
              content={getMessageByLocale(
                'options_about_toolTip',
                options.locale
              )}
            />
          </Stack.Item>
          <Stack style={stacksStyleOptions.settingStack}>
            <p>
              {getMessageByLocale('options_about_description', options.locale)}
            </p>
            <p>
              GitHub:{' '}
              <a href={HYPERCRX_GITHUB} target="_blank">
                {HYPERCRX_GITHUB}
              </a>
            </p>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

export default Options;
