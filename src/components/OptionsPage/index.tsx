import React, { useState, useEffect } from 'react';
import {
  Pivot, PivotItem, PivotLinkFormat, Stack, Toggle, DefaultButton, Checkbox
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import { getMessageI18n, chromeGet, chromeSet, isNull } from '../../utils/utils'
import Settings,{ loadSettings } from "../../utils/settings"
import './index.css';

initializeIcons();

const OptionsPage: React.FC = () => {

  const [settings, setSettings] = useState(new Settings());
  const [inited, setInited] = useState(false);
  const [version, setVersion] = useState("0.0.0");

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
    const obj = settings.toJson();
    await chromeSet("settings", obj);
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
            <PivotItem headerText={getMessageI18n("options_header_commandLine")} itemIcon="CommandPrompt">
              <Stack
                horizontalAlign="space-around"
                verticalAlign='center'
                style={{ margin: "5px", padding: "3px" }}
                tokens={{
                  childrenGap: 10
                }}
              >
              </Stack>
            </PivotItem>
          </Pivot>
        </div>
      </Stack>
    </Stack>
  )
}

export default OptionsPage;