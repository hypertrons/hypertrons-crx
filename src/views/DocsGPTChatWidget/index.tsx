import React from 'react';
import {
  Widget,
  addResponseMessage,
  toggleMsgLoader,
  toggleInputDisabled,
} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import { getGithubTheme } from '../../utils/utils';
import { getAnswer } from './service';

interface Props {
  currentRepo: string;
  currentDocsName: string | null;
}

const githubTheme = getGithubTheme();

const handleNewUserMessage = async (newMessage: string) => {
  toggleMsgLoader();
  toggleInputDisabled();

  // Now send the message throught the backend API
  const answer = await getAnswer('opendigger', newMessage);
  addResponseMessage(answer);

  toggleMsgLoader();
  toggleInputDisabled();
};

const View = ({ currentRepo, currentDocsName }: Props): JSX.Element => {
  const subtitle = currentDocsName
    ? `Ask anything about ${currentRepo}`
    : `Currently not available for ${currentRepo}`;
  return (
    <Widget
      title="OSS-GPT"
      subtitle={subtitle}
      emojis={true}
      resizable={true}
      handleNewUserMessage={handleNewUserMessage}
    />
  );
};

export default View;
