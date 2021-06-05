import React, { useState, useEffect } from 'react';
import { Stack, Text, FontIcon, IIconProps, DefaultButton, IStackTokens } from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import { getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';

initializeIcons();

const navigateBackIcon: IIconProps = { iconName: 'NavigateBack' };
const stackTokens: IStackTokens = { childrenGap: 20 };

const ErrorPage: React.FC = () => {
  const onButtonClick = () => {
    history.go(-1);
  }

  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
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

  return (
    <Stack tokens={stackTokens}>
      <Stack.Item align="center">
        <FontIcon iconName="Error" />
      </Stack.Item>
      <Stack.Item align="center">
        <Text>{getMessageByLocale("component_error_message",settings.locale)}</Text>
      </Stack.Item>
      <Stack.Item align="center">
        <DefaultButton
          text={getMessageByLocale("global_btn_goBack",settings.locale)}
          iconProps={navigateBackIcon}
          onClick={onButtonClick}
        />
      </Stack.Item>
    </Stack>
  )
}

export default ErrorPage;