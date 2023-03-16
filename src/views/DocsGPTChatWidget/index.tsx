import React, { useState, useEffect } from 'react';
import {
  Widget,
  addResponseMessage,
  deleteMessages,
  toggleMsgLoader,
  toggleInputDisabled,
} from 'react-chat-widget';
import $ from 'jquery';

import { getAnswer } from './service';
import './rcw.scss';

interface Props {
  theme: 'light' | 'dark';
  currentRepo: string;
  currentDocsName: string | null;
}

const displayWelcome = (repoName: string) => {
  addResponseMessage(
    `Hi, I'm an assistant powered by [DocsGPT](https://github.com/arc53/docsgpt) and [X-lab](https://github.com/X-lab2017). Ask me anything about \`${repoName}\`!`
  );
};

const displayNotAvailable = (repoName: string) => {
  addResponseMessage(
    `OSS-GPT currently is **NOT AVAILABLE** for \`${repoName}\`. If you want docs support for the repository, please check [this](https://github.com/hypertrons/hypertrons-crx/issues/609) issue and make a request there :)\n\nSee [all available docs](https://oss.x-lab.info/hypercrx/docsgpt_active_docs.json)\n\nThis chat widget can also be enabled/disabled in the extension options page whenever you want.`
  );
};

const View = ({ theme, currentRepo, currentDocsName }: Props): JSX.Element => {
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
  useEffect(() => {
    // Select the node that will be observed for mutations
    const targetNode = $('div.rcw-widget-container')[0]!;
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    const callback: MutationCallback = (mutationList, observer) => {
      if ($('section.emoji-mart').length > 0) {
        $('section.emoji-mart')
          .removeClass('emoji-mart-light')
          .addClass(`emoji-mart-${theme}`);
      }
    };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    return () => {
      // Later, you can stop observing
      observer.disconnect();
    };
  }, []);
  return (
    <div className={theme}>
      <Widget
        title="OSS-GPT"
        subtitle={subtitle}
        emojis={true} // will be enabled after style is fine tuned for two themes
        resizable={true}
        handleNewUserMessage={handleNewUserMessage}
        showBadge={false}
        profileAvatar={chrome.runtime.getURL('main.png')}
      />
    </div>
  );
};

export default View;
