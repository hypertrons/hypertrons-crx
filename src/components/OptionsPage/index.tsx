import React, { useState, useEffect } from 'react';
import {
  TooltipHost, Stack,
  Toggle, DefaultButton, Checkbox, Text, Link,
  Spinner, MessageBar, MessageBarType,
  Dialog, DialogType, TextField, ChoiceGroup, IChoiceGroupOption,
  Image, ImageFit, DialogFooter, PrimaryButton
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import { getMessageI18n, chromeSet, compareVersion, getLocale } from '../../utils/utils';
import { checkUpdate, checkIsTokenAvailabe } from '../../services/common';
import Settings, { loadSettings } from "../../utils/settings"
import MetaData, { loadMetaData } from '../../utils/metadata';
import { getNotificationInformation } from '../../services/background';
import { HYPERTRONS_CRX_WEBSITE } from '../../constant';
import './index.css';

initializeIcons();

export enum UpdateStatus {
  undefine = -1, no = 0, yes = 1
}

const OptionsPage: React.FC = () => {

  const [settings, setSettings] = useState(new Settings());
  const [metaData, setMetaData] = useState(new MetaData());
  const [inited, setInited] = useState(false);
  const [version, setVersion] = useState("0.0.0");
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [token, setToken] = useState("");
  const [checkingToken, setCheckingToken] = useState(false);
  const [showDialogToken, setShowDialogToken] = useState(false);
  const [showDialogTokenError, setShowDialogTokenError] = useState(false);
  const [showDialogNotification, setShowDialogNotification] = useState(false);
  const [notificationId, setNotificationId] = useState(0);
  const [notification, setNotification] = useState("");
  const [updateStatus, setUpdateStatus] = useState(UpdateStatus.undefine);
  const [updateUrl, setUpdateUrl] = useState("https://github.com/hypertrons/hypertrons-crx/releases");

  const options: IChoiceGroupOption[] = [
    {
      key: 'antv',
      text: 'Antv'
    },
    {
      key: 'echarts',
      text: 'Echarts'
    }
  ];

  useEffect(() => {
    const initMetaData = async () => {
      const tempMetaData = await loadMetaData();
      setMetaData(tempMetaData);
      if (tempMetaData.token !== "") {
        setToken(tempMetaData.token);
      }
      const notificationInformation = await getNotificationInformation();
      if (notificationInformation.is_published && tempMetaData.idLastNotication < notificationInformation.id) {
        const locale=getLocale();
        if (locale==="zh_CN") {
          setNotification(notificationInformation.content.zh);
        }
        else {
          setNotification(notificationInformation.content.en);
        }
        setNotificationId(notificationInformation.id);
        setShowDialogNotification(true);
      }
    }
    if (!inited) {
      initMetaData();
    }
  }, [inited, metaData]);

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    }
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  useEffect(() => {
    // @ts-ignore
    const details = chrome.app.getDetails();
    setVersion(details["version"]);
  }, [version]);

  const saveSettings = async (settings: Settings) => {
    setSettings(settings);
    await chromeSet("settings", settings.toJson());
  }

  const checkUpdateManually = async () => {
    setUpdateStatus(UpdateStatus.undefine);
    setCheckingUpdate(true);
    const [currentVersion, latestVersion,updateUrl] = await checkUpdate();
    if (compareVersion(currentVersion, latestVersion) === -1) {
      setUpdateUrl(updateUrl);
      setUpdateStatus(UpdateStatus.yes);
    }
    else {
      setUpdateStatus(UpdateStatus.no);
    }
    setCheckingUpdate(false);
  }

  if (!inited) {
    return (<div />);
  }

  return (
    <Stack>
      {
        showDialogNotification &&
        <Dialog
          hidden={!showDialogNotification}
          onDismiss={() => {
            setShowDialogNotification(false);
          }}
          dialogContentProps={{
            type: DialogType.normal,
            title: getMessageI18n("global_notificationTitle")
          }}
        >
          <Text variant="mediumPlus">
            {notification}
          </Text>
          <DialogFooter>
            <DefaultButton
              onClick={() => {
                setShowDialogNotification(false);
              }}
            >
              {getMessageI18n("global_btn_ok")}
            </DefaultButton>
            <PrimaryButton
              onClick={async () => {
                metaData.idLastNotication = notificationId;
                setMetaData(metaData);
                await chromeSet("meta_data", metaData.toJson());
                setShowDialogNotification(false);
              }}
            >
              {getMessageI18n("global_btn_disable")}
            </PrimaryButton>
          </DialogFooter>
        </Dialog>
      }
      {
        showDialogToken &&
        <Dialog
          hidden={!showDialogToken}
          onDismiss={() => {
            setShowDialogToken(false);
          }}
          dialogContentProps={{
            type: DialogType.normal,
            title: getMessageI18n("options_token_dialog_title")
          }}
        >
          <Stack horizontal style={{ fontSize: 16, margin: 5 }}>
            <Link href="https://github.com/settings/tokens" target="_blank" underline>
              {getMessageI18n("options_token_dialog_message")}
            </Link>
          </Stack>
          {
            checkingToken &&
            <Spinner label={getMessageI18n("options_token_dialog_checking")} />
          }
          {
            showDialogTokenError &&
            <MessageBar
              messageBarType={MessageBarType.error}
            >
              {getMessageI18n("options_token_dialog_error")}
            </MessageBar>
          }
          <Stack
            horizontal
            horizontalAlign="space-around"
            verticalAlign="end"
            style={{ margin: "10px" }}
            tokens={{
              childrenGap: 15
            }}
          >
            <TextField
              style={{ width: "200px" }}
              value={token}
              defaultValue={token}
              onChange={(e, value) => {
                if (value) {
                  setShowDialogTokenError(false);
                  setToken(value);
                }
              }}
            />
            <DefaultButton
              disabled={checkingToken}
              onClick={async () => {
                setCheckingToken(true);
                const result = await checkIsTokenAvailabe(token);
                setCheckingToken(false)
                if ("id" in result) {
                  metaData.token = token;
                  metaData.avatar = result["avatar_url"]
                  metaData.name = result["name"]
                  metaData.id = result["id"]
                  setMetaData(metaData);
                  await chromeSet("meta_data", metaData.toJson());
                  setShowDialogToken(false);
                } else {
                  setShowDialogTokenError(true);
                }
              }}
            >
              {getMessageI18n("global_btn_ok")}
            </DefaultButton>
          </Stack>
        </Dialog>
      }
      <Stack
        horizontalAlign="center"
        style={{ paddingBottom: '10px' }}
      >
        <h1>PERCEPTOR</h1>
        <sub>{`version ${version}`}</sub>
      </Stack>
      <Stack
        horizontalAlign="center"
        tokens={{
          childrenGap: 30
        }}
      >
        <Stack.Item className='Box'>
          <TooltipHost
            content={getMessageI18n("options_components_toolTip")}
          >
            <Stack.Item className='Box-header'>
              <h2 className='Box-title'>
                {getMessageI18n("options_components_title")}
              </h2>
            </Stack.Item>
          </TooltipHost>
          <Stack
            style={{ margin: '10px 25px' }}
            tokens={{
              childrenGap: 10
            }}
          >
            <p>{getMessageI18n("options_components_toolTip")} :</p>
            <Checkbox
              label={getMessageI18n("component_developerCollabrationNetwork_title")}
              defaultChecked={settings.developerNetwork}
              onChange={async (e, checked) => {
                settings.developerNetwork = checked;
                await saveSettings(settings);
              }}
            />
            <Checkbox
              label={getMessageI18n("component_projectCorrelationNetwork_title")}
              defaultChecked={settings.projectNetwork}
              onChange={async (e, checked) => {
                settings.projectNetwork = checked;
                await saveSettings(settings);
              }}
            />
          </Stack>
        </Stack.Item>
        <Stack.Item className='Box'>
          <TooltipHost
            content={getMessageI18n("options_graphType_toolTip")}
          >
            <Stack.Item className='Box-header'>
              <h2 className='Box-title'>
                {getMessageI18n("options_graphType_title")}
              </h2>
            </Stack.Item>
          </TooltipHost>
          <Stack
            style={{ margin: '10px 25px' }}
          >
            <p>{getMessageI18n("options_graphType_toolTip")} :</p>
            <ChoiceGroup
              defaultSelectedKey={settings.graphType}
              options={options}
              onChanged={async (option) => {
                settings.graphType = option.key as GraphType;
                await saveSettings(settings);
              }}
            />
          </Stack>
        </Stack.Item>
        <Stack.Item className='Box'>
          <TooltipHost
            content={getMessageI18n("options_update_toolTip")}
          >
            <Stack.Item className='Box-header'>
              <h2 className='Box-title'>
                {getMessageI18n("options_update_title")}
              </h2>
            </Stack.Item>
          </TooltipHost>
          <Stack
            style={{ margin: '10px 25px' }}
            tokens={{
              childrenGap: 10
            }}
          >
            <p>{getMessageI18n("options_update_toolTip")}.</p>
            <Toggle
              label={getMessageI18n('options_update_toggle_autoCheck')}
              defaultChecked={settings.checkForUpdates}
              onText={getMessageI18n('options_update_toggle_autoCheck_onText')}
              offText={getMessageI18n('options_update_toggle_autoCheck_offText')}
              onChange={async (e, checked) => {
                settings.checkForUpdates = checked;
                await saveSettings(settings);
              }}
            />
            {
              checkingUpdate &&
              <Stack horizontalAlign="start">
                <Spinner label={getMessageI18n("options_update_checking")} />
              </Stack>
            }
            {
              updateStatus === UpdateStatus.yes &&
              <MessageBar
                messageBarType={MessageBarType.success}
                isMultiline={false}
              >
                {getMessageI18n("options_update_btn_updateStatusYes")}
                <Link href={updateUrl} target="_blank" underline>
                  {getMessageI18n("options_update_btn_getUpdate")}
                </Link>
              </MessageBar>
            }
            {
              updateStatus === UpdateStatus.no &&
              <MessageBar
                messageBarType={MessageBarType.info}
                isMultiline={false}
              >
                {getMessageI18n("options_update_btn_updateStatusNo")}
              </MessageBar>
            }
            <DefaultButton
              style={{
                width: 120
              }}
              disabled={checkingUpdate}
              onClick={async () => {
                await checkUpdateManually();
              }}
            >
              {getMessageI18n("options_update_btn_checkUpdate")}
            </DefaultButton>
          </Stack>
        </Stack.Item>
        <Stack.Item className='Box'>
          <TooltipHost
            content={getMessageI18n("options_token_toolTip")}
          >
            <Stack.Item className='Box-header'>
              <h2 className='Box-title'>
                {getMessageI18n("options_token_title")}
              </h2>
            </Stack.Item>
          </TooltipHost>
          <Stack
            style={{ margin: '10px 25px' }}
            tokens={{
              childrenGap: 10
            }}
          >
            <p>{getMessageI18n("options_token_toolTip")} :</p>
            {
              metaData.token !== "" &&
              <Stack
                horizontal
                verticalAlign="center"
                style={{
                  margin: "5px", padding: "3px", width: "300px",
                  boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
                tokens={{
                  childrenGap: 5
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
                  style={{ marginLeft: 25, maxWidth: 200, wordWrap: "break-word" }}
                >
                  {metaData.name}
                </Text>
              </Stack>
            }
            <DefaultButton
              onClick={() => {
                setShowDialogToken(true);
              }}
              style={{
                width: 120
              }}
            >
              {getMessageI18n("options_token_btn_setToken")}
            </DefaultButton>
          </Stack>
        </Stack.Item>
        <Stack.Item className='Box'>
          <TooltipHost
            content={getMessageI18n("options_about_toolTip")}
          >
            <Stack.Item className='Box-header'>
              <h2 className='Box-title'>
                {getMessageI18n("options_about_title")}
              </h2>
            </Stack.Item>
          </TooltipHost>
          <Stack
            style={{ margin: '10px 25px' }}

          >
            <p>{getMessageI18n("options_about_description")}</p>
            <p>{getMessageI18n("options_about_description_website")}</p>
            <Link href={HYPERTRONS_CRX_WEBSITE} target="_blank" underline>
              {HYPERTRONS_CRX_WEBSITE}
            </Link>
          </Stack>
        </Stack.Item>

      </Stack>
    </Stack>
  )
}

export default OptionsPage;