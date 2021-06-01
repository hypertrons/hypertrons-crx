import React from 'react';
import { Stack, MessageBar, Link, MessageBarType } from 'office-ui-fabric-react';
import { getMessageI18n } from '../../utils/utils';
import { ErrorCode, HYPERTRONS_CRX_ISSUES_LINK } from '../../constant';

interface ErrorMessageBarProps {
  errorCode?: number;
  url?: string;
}

const ErrorMessageBar: React.FC<ErrorMessageBarProps> = ({
  errorCode = ErrorCode.UNKNOWN,
  url = HYPERTRONS_CRX_ISSUES_LINK
}) => {
  return (
    <Stack >
      <Stack.Item align="center">
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          dismissButtonAriaLabel="Close"
        >
          {getMessageI18n("global_error_message")}{errorCode}.
          <Link href={url} target="_blank" underline>
            {getMessageI18n("global_clickToshow")} Issue.
          </Link>
        </MessageBar>
      </Stack.Item>
    </Stack>

  )
}

export default ErrorMessageBar;