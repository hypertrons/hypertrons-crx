import React, { useState, useEffect } from 'react';
import {
  TooltipHost,
  Stack,
  Checkbox,
  Link,
  ChoiceGroup,
  IChoiceGroupOption,
} from 'office-ui-fabric-react';
import {
  Settings,
  FeatureOption,
  loadSettings,
  defaultSettings,
  saveSettings,
  setFeatureSettings,
} from '../../utils/settings';
import { getMessageByLocale } from '../../utils/utils';
import { HYPERTRONS_CRX_WEBSITE } from '../../constant';
import './Options.css';

interface Props {
  importedFeatures: FeatureID[];
}

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

const Options = (props: Props): JSX.Element => {
  const { importedFeatures } = props;

  const [inited, setInited] = useState(false);
  const [version, setVersion] = useState('0.0.0');
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  async function toggleFeature({ id, checked }: any) {
    await saveSettings({
      ...settings,
      featureOptions: settings.featureOptions.map(
        (featureOption: FeatureOption) => {
          if (featureOption.id === id) {
            return { ...featureOption, isEnabled: checked };
          }
          return featureOption;
        }
      ),
    });
  }

  useEffect(() => {
    async function init() {
      const version = (await chrome.management.getSelf()).version;
      setVersion(version);

      await setFeatureSettings(importedFeatures);
      setSettings(await loadSettings());
      setInited(true);
    }
    init();
  }, []);

  if (!inited) {
    return <div />;
  }

  function buildFeatureCheckbox({ id, isEnabled }: any) {
    return (
      <Checkbox
        label={id}
        defaultChecked={isEnabled}
        onChange={async (e, checked) => {
          await toggleFeature({ id, checked });
        }}
      />
    );
  }

  return (
    <Stack>
      <Stack horizontalAlign="center" style={{ paddingBottom: '10px' }}>
        <h1>PERCEPTOR</h1>
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
              settings.locale
            )}
          >
            <Stack.Item className="Box-header">
              <h2 className="Box-title">
                {getMessageByLocale('options_locale_title', settings.locale)}
              </h2>
            </Stack.Item>
          </TooltipHost>
          <Stack style={{ margin: '10px 25px' }}>
            <p>
              {getMessageByLocale('options_locale_toolTip', settings.locale)} :
            </p>
            <ChoiceGroup
              defaultSelectedKey={settings.locale}
              options={localeOptions}
              onChange={async (e, option: any) => {
                setSettings({
                  ...settings,
                  locale: option.key,
                });
                await saveSettings(settings);
              }}
            />
          </Stack>
        </Stack.Item>
        <Stack.Item className="Box">
          <TooltipHost
            content={getMessageByLocale(
              'options_components_toolTip',
              settings.locale
            )}
          >
            <Stack.Item className="Box-header">
              <h2 className="Box-title">
                {getMessageByLocale(
                  'options_components_title',
                  settings.locale
                )}
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
              {getMessageByLocale(
                'options_components_toolTip',
                settings.locale
              )}{' '}
              :
            </p>
            {settings.featureOptions.map((featureOption) =>
              buildFeatureCheckbox(featureOption)
            )}
          </Stack>
        </Stack.Item>
        <Stack.Item className="Box">
          <TooltipHost
            content={getMessageByLocale(
              'options_about_toolTip',
              settings.locale
            )}
          >
            <Stack.Item className="Box-header">
              <h2 className="Box-title">
                {getMessageByLocale('options_about_title', settings.locale)}
              </h2>
            </Stack.Item>
          </TooltipHost>
          <Stack style={{ margin: '10px 25px' }}>
            <p>
              {getMessageByLocale('options_about_description', settings.locale)}
            </p>
            <p>
              {getMessageByLocale(
                'options_about_description_website',
                settings.locale
              )}
            </p>
            <Link href={HYPERTRONS_CRX_WEBSITE} target="_blank" underline>
              {HYPERTRONS_CRX_WEBSITE}
            </Link>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

export default Options;
