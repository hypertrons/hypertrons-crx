import React, { useState, useEffect } from 'react';
import {
  TooltipHost,
  Stack,
  Toggle,
  DefaultButton,
  Checkbox,
  Text,
  Link,
  Spinner,
  MessageBar,
  MessageBarType,
  Dialog,
  DialogType,
  TextField,
  ChoiceGroup,
  IChoiceGroupOption,
  Image,
  ImageFit,
  DialogFooter,
  PrimaryButton,
} from 'office-ui-fabric-react';
import { getMessageByLocale, chromeSet } from '../../utils/utils';
import { checkIsTokenAvailabe } from '../../services/common';
import Settings, { loadSettings } from '../../utils/settings';
import MetaData, { loadMetaData } from '../../utils/metadata';
import { HYPERTRONS_CRX_WEBSITE } from '../../constant';
import './Options.css';

const Options: React.FC = () => {
  const [settings, setSettings] = useState(new Settings());
  const [metaData, setMetaData] = useState(new MetaData());
  const [inited, setInited] = useState(false);
  const [version, setVersion] = useState('0.0.0');
  const [token, setToken] = useState('');
  const [checkingToken, setCheckingToken] = useState(false);
  const [showDialogToken, setShowDialogToken] = useState(false);
  const [showDialogTokenError, setShowDialogTokenError] = useState(false);
  const tokenCurrent = metaData.token;

  const locale = settings.locale;
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
    const initMetaData = async () => {
      const tempMetaData = await loadMetaData();
      setMetaData(tempMetaData);
      if (tempMetaData.token !== '') {
        setToken(tempMetaData.token);
      }
    };
    if (!inited) {
      initMetaData();
    }
  }, [inited, locale, metaData]);

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
      {showDialogToken && (
        <Dialog
          hidden={!showDialogToken}
          onDismiss={() => {
            setShowDialogToken(false);
          }}
          dialogContentProps={{
            type: DialogType.normal,
            title: getMessageByLocale(
              'options_token_dialog_title',
              settings.locale
            ),
          }}
          modalProps={{
            isBlocking: true,
          }}
        >
          <p style={{ fontSize: 14, color: '#6a737d', margin: 5 }}>
            {getMessageByLocale(
              'options_token_dialog_description',
              settings.locale
            )}
          </p>
          <Stack horizontal style={{ fontSize: 16, margin: 5 }}>
            <Link
              href="https://github.com/settings/tokens/new"
              target="_blank"
              underline
            >
              {getMessageByLocale(
                'options_token_dialog_message',
                settings.locale
              )}
            </Link>
          </Stack>
          {checkingToken && (
            <Spinner
              label={getMessageByLocale(
                'options_token_dialog_checking',
                settings.locale
              )}
            />
          )}
          {showDialogTokenError && (
            <MessageBar messageBarType={MessageBarType.error}>
              {getMessageByLocale(
                'options_token_dialog_error',
                settings.locale
              )}
            </MessageBar>
          )}
          <Stack
            horizontal
            horizontalAlign="space-around"
            verticalAlign="end"
            style={{ margin: '10px' }}
            tokens={{
              childrenGap: 15,
            }}
          >
            <TextField
              style={{ width: '200px' }}
              defaultValue={token}
              onChange={(e, value) => {
                if (value) {
                  setShowDialogTokenError(false);
                  setToken(value);
                }
              }}
            />
            <PrimaryButton
              disabled={checkingToken}
              onClick={async () => {
                setCheckingToken(true);
                const result = await checkIsTokenAvailabe(token);
                setCheckingToken(false);
                if ('id' in result) {
                  metaData.token = token;
                  metaData.avatar = result['avatar_url'];
                  metaData.name = result['name'];
                  metaData.id = result['id'];
                  setMetaData(metaData);
                  await chromeSet('meta_data', metaData.toJson());
                  setShowDialogToken(false);
                } else {
                  setShowDialogTokenError(true);
                }
              }}
            >
              {getMessageByLocale('global_btn_ok', settings.locale)}
            </PrimaryButton>
          </Stack>
          {tokenCurrent !== '' && (
            <DefaultButton
              onClick={async () => {
                metaData.token = '';
                metaData.avatar = '';
                metaData.name = '';
                metaData.id = '';
                setMetaData(metaData);
                await chromeSet('meta_data', metaData.toJson());
                setShowDialogToken(false);
              }}
              style={{
                width: 120,
              }}
            >
              {getMessageByLocale('options_token_btn_rmToken', settings.locale)}
            </DefaultButton>
          )}
        </Dialog>
      )}
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
              'options_token_toolTip',
              settings.locale
            )}
          >
            <Stack.Item className="Box-header">
              <h2 className="Box-title">
                {getMessageByLocale('options_token_title', settings.locale)}
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
              {getMessageByLocale('options_token_toolTip', settings.locale)} :
            </p>
            {tokenCurrent !== '' && (
              <Stack
                horizontal
                verticalAlign="center"
                style={{
                  margin: '5px',
                  padding: '3px',
                  width: '300px',
                  boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2)',
                }}
                tokens={{
                  childrenGap: 5,
                }}
              >
                <Image
                  width={75}
                  height={75}
                  src={metaData.avatar}
                  imageFit={ImageFit.centerCover}
                />
                <Text
                  variant="large"
                  style={{
                    marginLeft: 25,
                    maxWidth: 200,
                    wordWrap: 'break-word',
                  }}
                >
                  {metaData.name}
                </Text>
              </Stack>
            )}
            <DefaultButton
              onClick={() => {
                setShowDialogToken(true);
              }}
              style={{
                width: 120,
              }}
            >
              {getMessageByLocale(
                'options_token_btn_setToken',
                settings.locale
              )}
            </DefaultButton>
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
