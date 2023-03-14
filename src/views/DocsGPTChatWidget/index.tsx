import React, { useEffect } from 'react';
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
    : `NOT AVAILABLE for ${currentRepo}`;

  useEffect(() => {
    if (currentDocsName) {
      addResponseMessage(
        `Hi, I'm an assistant powered by [DocsGPT](https://github.com/arc53/docsgpt), a GPT-3 powered chatbot that answers questions about documentation. Ask me anything about \`${currentRepo}\`!`
      );
    } else {
      addResponseMessage(
        `OSS-GPT currently is **NOT AVAILABLE** for \`${currentRepo}\`, if you want docs support for the repository, please visit [this](https://github.com/hypertrons/hypertrons-crx/issues) issue and make a request there :)\n\nSee [all available docs](https://oss.x-lab.info/hypercrx/docsgpt_active_docs.json)`
      );
    }
  }, [currentDocsName]);

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
