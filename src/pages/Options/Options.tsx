import React, { useState, useEffect } from 'react';
import {
  TooltipHost,
  Stack,
  Checkbox,
  Link,
  ChoiceGroup,
  IChoiceGroupOption,
} from 'office-ui-fabric-react';

import { importedFeatures } from '../../../README.md';
import optionsStorage, { HypercrxOptions } from '../../options-storage';
import getMessageByLocale from '../../helpers/get-message-by-locale';
import { HYPERCRX_GITHUB } from '../../constant';
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
        label={name}
        defaultChecked={isEnabled}
        onChange={async (e, checked) => {
          await optionsStorage.set({ [`hypercrx-${name}`]: checked });
          setOptions(await optionsStorage.getAll());
        }}
      />
    );
  }

  return (
    <Stack>
      <Stack horizontalAlign="center" style={{ paddingBottom: '10px' }}>
        <h1>Hypercrx</h1>
        <sub>{`version ${version}`}</sub>
      </Stack>
      <Stack
        horizontalAlign="center"
        tokens={{
          childrenGap: 30,
        }}
      >
        <Stack.Item className="Box">
          <TooltipHost
            content={getMessageByLocale(
              'options_locale_toolTip',
              options.locale
            )}
          >
            <Stack.Item className="Box-header">
              <h2 className="Box-title">
                {getMessageByLocale('options_locale_title', options.locale)}
              </h2>
            </Stack.Item>
          </TooltipHost>
          <Stack style={{ margin: '10px 25px' }}>
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
          <TooltipHost
            content={getMessageByLocale(
              'options_components_toolTip',
              options.locale
            )}
          >
            <Stack.Item className="Box-header">
              <h2 className="Box-title">
                {getMessageByLocale('options_components_title', options.locale)}
              </h2>
            </Stack.Item>
          </TooltipHost>
          <Stack
            style={{ margin: '10px 25px' }}
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
          <TooltipHost
            content={getMessageByLocale(
              'options_about_toolTip',
              options.locale
            )}
          >
            <Stack.Item className="Box-header">
              <h2 className="Box-title">
                {getMessageByLocale('options_about_title', options.locale)}
              </h2>
            </Stack.Item>
          </TooltipHost>
          <Stack style={{ margin: '10px 25px' }}>
            <p>
              {getMessageByLocale('options_about_description', options.locale)}
            </p>
            <p>
              GitHub:{' '}
              <Link href={HYPERCRX_GITHUB} target="_blank" underline>
                {HYPERCRX_GITHUB}
              </Link>
            </p>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

export default Options;
