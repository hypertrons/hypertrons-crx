import React, { useState, useEffect } from 'react';
import {
  Pivot, PivotItem, PivotLinkFormat, Stack, Toggle, DefaultButton, Checkbox
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import { getMessageI18n, chromeGet, chromeSet, isNull } from '../../utils/utils'
import Settings from "../../utils/settings"
import './index.css';

initializeIcons();

const OptionsPage: React.FC = () => {

  const [settings, setSettings] = useState(new Settings());
  const [inited, setInited] = useState(false);

  useEffect(() => {
    const initSettings = async () => {
      let obj = await chromeGet("settings");
      if (isNull(obj)) {
        obj = {};
      }
      settings.loadFromJson(obj);
      setSettings(settings);
      setInited(true);
    }
    initSettings();
  }, [settings]);

  const saveSettings = async () => {
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
        <sub>version 0.1.2</sub>
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
                <Checkbox
                  label={getMessageI18n("component_developerCollabrationNetwork_title")}
                  defaultChecked={settings.developerNetwork}
                  onChange={async (e, checked) => {
                    settings.developerNetwork = checked;
                    await saveSettings();
                  }}
                />
                <Checkbox
                  label={getMessageI18n("component_projectCorrelationNetwork_title")}
                  defaultChecked={settings.projectNetwork}
                  onChange={async (e, checked) => {
                    settings.projectNetwork = checked;
                    await saveSettings();
                  }}
                />
                <Stack
                  horizontalAlign="start"
                  verticalAlign='center'
                  horizontal
                  tokens={{
                    childrenGap: 10
                  }}
                >
                  <DefaultButton
                    style={{ width: 100 }}
                    onClick={() => {
                    }}
                  >
                    {getMessageI18n("global_btn_ok")}
                  </DefaultButton>
                </Stack>
                <Toggle
                  label={getMessageI18n('options_toggle_checkForUpdates')}
                  defaultChecked={settings.checkForUpdates}
                  onText={getMessageI18n('options_toggle_checkForUpdates_onText')}
                  offText={getMessageI18n('options_toggle_checkForUpdates_offText')}
                  onChange={async (e, checked) => {
                    settings.checkForUpdates = checked;
                    await saveSettings();
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