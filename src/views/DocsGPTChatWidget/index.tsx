import React, { useState, useEffect } from 'react';
import {
  Widget,
  addResponseMessage,
  deleteMessages,
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

const displayWelcome = (repoName: string) => {
  addResponseMessage(
    `Hi, I'm an assistant powered by [DocsGPT](https://github.com/arc53/docsgpt) and [X-lab](https://github.com/X-lab2017). Ask me anything about \`${repoName}\`!`
  );
};

const displayNotAvailable = (repoName: string) => {
  addResponseMessage(
    `OSS-GPT currently is **NOT AVAILABLE** for \`${repoName}\`, if you want docs support for the repository, please visit [this](https://github.com/hypertrons/hypertrons-crx/issues) issue and make a request there :)\n\nSee [all available docs](https://oss.x-lab.info/hypercrx/docsgpt_active_docs.json)`
  );
};

const View = ({ currentRepo, currentDocsName }: Props): JSX.Element => {
  const subtitle = currentDocsName
    ? `Ask anything about ${currentRepo}`
    : `NOT AVAILABLE for ${currentRepo}`;

  const [history, setHistory] = useState<[string, string]>(['', '']);

  const handleNewUserMessage = async (newMessage: string) => {
    toggleMsgLoader();
    toggleInputDisabled();

    if (currentDocsName) {
      const answer = await getAnswer(currentDocsName, newMessage, history);
      addResponseMessage(answer);
      setHistory([newMessage, answer]); // update history
    } else {
      displayNotAvailable(currentRepo);
    }

    toggleMsgLoader();
    toggleInputDisabled();
  };

  useEffect(() => {
    // when repo changes
    deleteMessages(Infinity); // delete all messages after repo switching
    setHistory(['', '']); // clear history
    if (currentDocsName) {
      // if docs for current repo is available
      displayWelcome(currentRepo);
    } else {
      displayNotAvailable(currentRepo);
    }
  }, [currentRepo, currentDocsName]);

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
