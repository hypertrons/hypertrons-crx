import React, { useState, useEffect } from 'react';
import { Stack, FontIcon, IIconProps, DefaultButton, IStackTokens, Link } from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import { getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { HYPERTRONS_CRX_NEW_ISSUE } from '../../constant';

initializeIcons();

const navigateBackIcon: IIconProps = { iconName: 'NavigateBack' };
const stackTokens: IStackTokens = { childrenGap: 20 };

interface ErrorPageProps {
  errorCode: number;
}


const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode }) => {


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

  const errMessageObj = getMessageByLocale(`global_error_message_${errorCode}`, settings.locale)

  const onButtonClick = () => {
    history.go(-1);
  }

  return (
    <Stack
      tokens={stackTokens}
      style={{
        width: '250px',
        margin: 'auto'
      }}
    >
      <Stack.Item>
        <FontIcon iconName="PageRemove" style={{ fontSize: 30 }} />
      </Stack.Item>
      <Stack.Item>
        <h3>{errMessageObj.status}</h3>
      </Stack.Item>
      <Stack.Item >
        <strong>{errMessageObj.measure.text}</strong>
        <ul style={{ margin: '15px 0 0 15px' }}>
          {errMessageObj.measure.tips.map((tip: string) => {
            return (
              <li>{tip}</li>
            )
          })}
        </ul>
      </Stack.Item>
      <Stack.Item>
        <Link href={HYPERTRONS_CRX_NEW_ISSUE} target="_blank" underline>
          {getMessageByLocale("global_sendFeedback", settings.locale)}
        </Link>
      </Stack.Item>
      <Stack.Item>
        <DefaultButton
          text={getMessageByLocale("global_btn_goBack", settings.locale)}
          iconProps={navigateBackIcon}
          onClick={onButtonClick}
        />
      </Stack.Item>
    </Stack >
  )
}

export default ErrorPage;