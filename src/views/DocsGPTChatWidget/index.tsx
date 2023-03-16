import React, { useState, useEffect } from 'react';
import {
  Widget,
  addResponseMessage,
  deleteMessages,
  toggleMsgLoader,
  toggleInputDisabled,
} from 'react-chat-widget';

import { getAnswer } from './service';
import './rcw.scss';
import { getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';

interface Props {
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

const View = ({ currentRepo, currentDocsName }: Props): JSX.Element => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [history, setHistory] = useState<[string, string]>(['', '']);

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    };
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  const subtitle = currentDocsName
    ? getMessageByLocale('OSS_GPT_subtitle', settings.locale).replace(
        '%v',
        currentRepo
      )
    : getMessageByLocale(
        'OSS_GPT_subtitle_notAvailable',
        settings.locale
      ).replace('%v', currentRepo);

  const handleNewUserMessage = async (newMessage: string) => {
    toggleMsgLoader();
    toggleInputDisabled();

    if (currentDocsName) {
      const answer = await getAnswer(currentDocsName, newMessage, history);
      addResponseMessage(answer);
      setHistory([newMessage, answer]); // update history
    } else {
      displayNotAvailable(currentRepo, settings.locale);
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
      displayWelcome(currentRepo, settings.locale);
    } else {
      displayNotAvailable(currentRepo, settings.locale);
    }
  }, [settings, currentRepo, currentDocsName]);

  return (
    <Widget
      title="OSS-GPT"
      subtitle={subtitle}
      emojis={false} // will be enabled after style is fine tuned for two themes
      resizable={true}
      handleNewUserMessage={handleNewUserMessage}
      showBadge={false}
      profileAvatar={chrome.runtime.getURL('main.png')}
    />
  );
};

export default View;
