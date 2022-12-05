import React, { useState, useEffect } from 'react';
import {
  TooltipHost,
  Stack,
  Toggle,
  Checkbox,
  Link,
  ChoiceGroup,
  IChoiceGroupOption,
} from 'office-ui-fabric-react';
import { getMessageByLocale, chromeSet } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { HYPERTRONS_CRX_WEBSITE } from '../../constant';
import './Options.css';

const Options: React.FC = () => {
  const [settings, setSettings] = useState(new Settings());
  const [inited, setInited] = useState(false);
  const [version, setVersion] = useState('0.0.0');

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

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    };
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  const getVersion = async () => {
    let version = (await chrome.management.getSelf()).version;
    setVersion(version);
  };

  useEffect(() => {
    getVersion();
  }, [version]);

  const saveSettings = async (settings: Settings) => {
    setSettings(settings);
    await chromeSet('settings', settings.toJson());
  };

  if (!inited) {
    return <div />;
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
              'options_enable_toolTip',
              settings.locale
            )}
          >
            <Stack.Item className="Box-header">
              <h2 className="Box-title">
                {getMessageByLocale('options_enable_title', settings.locale)}
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
              {getMessageByLocale('options_enable_toolTip', settings.locale)}.
            </p>
            <Toggle
              label={getMessageByLocale(
                'options_enable_toggle_autoCheck',
                settings.locale
              )}
              defaultChecked={settings.isEnabled}
              onText={getMessageByLocale(
                'global_toggle_onText',
                settings.locale
              )}
              offText={getMessageByLocale(
                'global_toggle_offText',
                settings.locale
              )}
              onChange={async (e, checked) => {
                settings.isEnabled = checked;
                await saveSettings(settings);
              }}
            />
          </Stack>
        </Stack.Item>
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
                settings.locale = option.key;
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
            <Checkbox
              label={getMessageByLocale(
                'component_developerCollabrationNetwork_title',
                settings.locale
              )}
              defaultChecked={settings.developerNetwork}
              onChange={async (e, checked) => {
                settings.developerNetwork = checked;
                await saveSettings(settings);
              }}
            />
            <Checkbox
              label={getMessageByLocale(
                'component_projectCorrelationNetwork_title',
                settings.locale
              )}
              defaultChecked={settings.projectNetwork}
              onChange={async (e, checked) => {
                settings.projectNetwork = checked;
                await saveSettings(settings);
              }}
            />
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
