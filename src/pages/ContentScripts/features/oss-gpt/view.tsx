import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import {
  Widget,
  addResponseMessage,
  deleteMessages,
  toggleMsgLoader,
  toggleInputDisabled,
} from 'react-chat-widget';

import { getAnswer } from './service';
import './rcw.scss';
import { getMessageByLocale } from '../../../../utils/utils';
import optionsStorage, { HypercrxOptions } from '../../../../options-storage';

interface Props {
  theme: 'light' | 'dark';
  currentRepo: string;
  currentDocsName: string | null;
}

const displayWelcome = (repoName: string, locale: string) => {
  addResponseMessage(
    getMessageByLocale('OSS_GPT_welcome', locale).replace('%v', repoName)
  );
};

const displayNotAvailable = (repoName: string, locale: string) => {
  addResponseMessage(
    getMessageByLocale('OSS_GPT_notAvailable', locale).replace('%v', repoName)
  );
};

const View = ({ theme, currentRepo, currentDocsName }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>();
  const [history, setHistory] = useState<[string, string]>(['', '']);

  if (!options) {
    return <div />;
  }

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  useEffect(() => {
    // when repo changes
    deleteMessages(Infinity); // delete all messages after repo switching
    setHistory(['', '']); // clear history
    if (currentDocsName) {
      // if docs for current repo is available
      displayWelcome(currentRepo, options.locale);
    } else {
      displayNotAvailable(currentRepo, options.locale);
    }
  }, [options, currentRepo, currentDocsName]);

  // we cannot change emoji-mart theme with an option, so we have to use MutationObserver and jquery to change the css
  useEffect(() => {
    // Select the node that will be observed for mutations
    const targetNode = $('div.rcw-widget-container')[0]!;
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    const callback: MutationCallback = (mutationList, observer) => {
      if ($('section.emoji-mart').length > 0) {
        $('section.emoji-mart').addClass(`emoji-mart emoji-mart-${theme}`);
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

  const subtitle = currentDocsName
    ? getMessageByLocale('OSS_GPT_subtitle', options.locale).replace(
        '%v',
        currentRepo
      )
    : getMessageByLocale(
        'OSS_GPT_subtitle_notAvailable',
        options.locale
      ).replace('%v', currentRepo);

  const handleNewUserMessage = async (newMessage: string) => {
    toggleMsgLoader();
    toggleInputDisabled();

    if (currentDocsName) {
      const answer = await getAnswer(currentDocsName, newMessage, history);
      addResponseMessage(answer);
      setHistory([newMessage, answer]); // update history
    } else {
      displayNotAvailable(currentRepo, options.locale);
    }

    toggleMsgLoader();
    toggleInputDisabled();
  };

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
