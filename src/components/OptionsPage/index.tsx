import React, { useState, useEffect } from 'react';
import {
  Pivot, PivotItem, PivotLinkFormat, Stack,
  Toggle, DefaultButton, Checkbox,Text,Link,
  Spinner, SpinnerSize, MessageBar, MessageBarType,
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import { getMessageI18n, chromeSet, compareVersion } from '../../utils/utils';
import Settings,{ loadSettings } from "../../utils/settings"
import { checkUpdate } from '../../services/common';
import './index.css';

initializeIcons();

export enum UpdateStatus {
  undefine = -1, no = 0, yes = 1
}

const OptionsPage: React.FC = () => {

  const [settings, setSettings] = useState(new Settings());
  const [inited, setInited] = useState(false);
  const [version, setVersion] = useState("0.0.0");
  const [checking, setChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(UpdateStatus.undefine);

  useEffect(() => {
    const initSettings = async () => {
      const temp=await loadSettings();
      setSettings(temp);
      setInited(true);
    }
    initSettings();
  }, [settings]);

  useEffect(() => {
    // @ts-ignore
    const details=chrome.app.getDetails();
    setVersion(details["version"]);
  }, [version]);

  const saveSettings = async (settings:Settings) => {
    setSettings(settings);
    await chromeSet("settings", settings.toJson());
  }

  const checkUpdateManually= async ()=>{
    setUpdateStatus(UpdateStatus.undefine);
    setChecking(true);
    const [currentVersion,latestVersion]=await checkUpdate();
    if(compareVersion(currentVersion,latestVersion)===-1) {
      setUpdateStatus(UpdateStatus.yes);
    }
    else{
      setUpdateStatus(UpdateStatus.no);
    }
    setChecking(false);
  }

  if (!inited) {
    return (<div />);
  }

  return (
    <Stack>
      <Stack horizontalAlign="center">
        <h1>HYPERTRONS</h1>
        <sub>{`version ${version}`}</sub>
      </Stack>
      <Stack horizontalAlign="center">
        <div className="container">
          <Pivot
            style={{ margin: "3px" }}
            linkFormat={PivotLinkFormat.tabs}
          >
            <PivotItem headerText={getMessageI18n("options_header_settings")} itemIcon="Settings">
              <Stack
                horizontalAlign="space-around"
                verticalAlign='center'
                style={{ margin: "5px", padding: "3px" }}
                tokens={{
                  childrenGap: 10
                }}
              >
                <Toggle
                  label={getMessageI18n('options_toggle_checkForUpdates')}
                  defaultChecked={settings.checkForUpdates}
                  onText={getMessageI18n('options_toggle_checkForUpdates_onText')}
                  offText={getMessageI18n('options_toggle_checkForUpdates_offText')}
                  onChange={async (e, checked) => {
                    settings.checkForUpdates = checked;
                    await saveSettings(settings);
                  }}
                />

                <Stack
                  style={{
                    maxWidth:240
                  }}
                  tokens={{
                    childrenGap:10
                  }}
                >
                  {
                    checking&&
                    <Stack horizontalAlign="start">
                      <Spinner label={getMessageI18n("options_text_checking")} />
                    </Stack>
                  }
                  {
                    updateStatus===UpdateStatus.yes&&
                    <MessageBar
                      messageBarType={MessageBarType.success}
                      isMultiline={false}
                    >
                      {getMessageI18n("options_text_updateStatusYes")}
                      <Link href="https://github.com/hypertrons/hypertrons-crx/" target="_blank" underline>
                        {getMessageI18n("options_text_goGetUpdate")}
                      </Link>
                    </MessageBar>
                  }
                  {
                    updateStatus===UpdateStatus.no&&
                    <MessageBar
                      messageBarType={MessageBarType.info}
                      isMultiline={false}
                    >
                      {getMessageI18n("options_text_updateStatusNo")}
                    </MessageBar>
                  }
                  <DefaultButton
                    style={{
                      width:120
                    }}
                    disabled={checking}
                    onClick={async ()=>{
                      await checkUpdateManually();
                    }}
                  >
                    {getMessageI18n("options_text_checkUpdate")}
                  </DefaultButton>
                </Stack>

                <Text variant="xxLarge">
                  {getMessageI18n("options_text_showDifferentComponent")}
                </Text>
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
            </PivotItem>
            {/*<PivotItem headerText={getMessageI18n("options_header_commandLine")} itemIcon="CommandPrompt">*/}
            {/*  <Stack*/}
            {/*    horizontalAlign="space-around"*/}
            {/*    verticalAlign='center'*/}
            {/*    style={{ margin: "5px", padding: "3px" }}*/}
            {/*    tokens={{*/}
            {/*      childrenGap: 10*/}
            {/*    }}*/}
            {/*  >*/}
            {/*  </Stack>*/}
            {/*</PivotItem>*/}
          </Pivot>
        </div>
      </Stack>
    </Stack>
  )
}

export default OptionsPage;