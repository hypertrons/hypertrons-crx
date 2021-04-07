import React from 'react';
import { Stack, MessageBar, Link, MessageBarType } from 'office-ui-fabric-react';
import { getMessageI18n } from '../../utils/utils';

interface ErrorMessageBarProps {
  url?: string;
}

const ErrorMessageBar: React.FC<ErrorMessageBarProps> = ({
  url = "https://github.com/hypertrons/hypertrons-crx/issues?q=is%3Aissue"
}) => {
  return (
    <Stack >
      <Stack.Item align="center">
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          dismissButtonAriaLabel="Close"
        >
          {getMessageI18n("global_error_message")}
          <Link href={url} target="_blank" underline>
            {getMessageI18n("global_search")} Issue.
          </Link>
        </MessageBar>
      </Stack.Item>
    </Stack>

  )
}

export default ErrorMessageBar;