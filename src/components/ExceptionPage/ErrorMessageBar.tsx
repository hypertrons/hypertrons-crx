import React, { useEffect, useState } from 'react';
import { Stack, MessageBar, Link, MessageBarType } from 'office-ui-fabric-react';
import { getMessageByLocale } from '../../utils/utils';
import { ErrorCode, HYPERTRONS_CRX_ISSUES_LINK } from '../../constant';
import Settings, { loadSettings } from '../../utils/settings';

interface ErrorMessageBarProps {
  errorCode?: number;
  url?: string;
}

const ErrorMessageBar: React.FC<ErrorMessageBarProps> = ({
  errorCode = ErrorCode.UNKNOWN,
  url = HYPERTRONS_CRX_ISSUES_LINK
}) => {
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
    <Stack >
      <Stack.Item align="center">
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          dismissButtonAriaLabel="Close"
        >
          {getMessageByLocale("global_error_message", settings.locale)}{errorCode}.
          <Link href={url} target="_blank" underline>
            {getMessageByLocale("global_clickToshow", settings.locale)} Issue.
          </Link>
        </MessageBar>
      </Stack.Item>
    </Stack>

  )
}

export default ErrorMessageBar;