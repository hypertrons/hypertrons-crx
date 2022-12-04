import React, { useEffect, useState } from 'react';
import { Stack, Toggle } from 'office-ui-fabric-react';
import './Popup.css';
import Settings, { loadSettings } from '../../utils/settings';
import { chromeSet, getMessageByLocale } from '../../utils/utils';

const Popup: React.FC = () => {
  const [settings, setSettings] = useState(new Settings());
  const [inited, setInited] = useState(false);

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

  const saveSettings = async (settings: Settings) => {
    setSettings(settings);
    await chromeSet('settings', settings.toJson());
  };

  if (!inited) {
    return <div />;
  }

  return (
    <Stack horizontalAlign="center">
      <Stack
        horizontalAlign="space-around"
        verticalAlign="center"
        style={{ margin: '5px', padding: '3px' }}
        tokens={{
          childrenGap: 10,
        }}
      >
        <Stack horizontalAlign="center">
          <Toggle
            label={getMessageByLocale(
              'options_enable_toggle_autoCheck',
              settings.locale
            )}
            defaultChecked={settings.isEnabled}
            onText={getMessageByLocale('global_toggle_onText', settings.locale)}
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
      </Stack>
    </Stack>
  );
};

export default Popup;
