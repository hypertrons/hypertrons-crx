import React from 'react';
import { Stack, Text, FontIcon, IIconProps, DefaultButton, IStackTokens } from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import { getMessageI18n } from '../../utils/utils';

initializeIcons();

const navigateBackIcon: IIconProps = { iconName: 'NavigateBack' };
const stackTokens: IStackTokens = { childrenGap: 20 };

const ErrorPage: React.FC = () => {
  const onButtonClick = () => {
    history.go(-1);
  }
  return (
    <Stack tokens={stackTokens}>
      <Stack.Item align="center">
        <FontIcon iconName="Error" />
      </Stack.Item>
      <Stack.Item align="center">
        <Text>{getMessageI18n("component_error_message")}</Text>
      </Stack.Item>
      <Stack.Item align="center">
        <DefaultButton
          text={getMessageI18n("global_btn_goBack")}
          iconProps={navigateBackIcon}
          onClick={onButtonClick}
        />
      </Stack.Item>
    </Stack>
  )
}

export default ErrorPage;