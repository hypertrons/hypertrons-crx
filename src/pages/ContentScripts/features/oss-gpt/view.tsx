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
import Settings, { loadSettings } from '../../../../utils/settings';

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

  // we cannot change emoji-mart theme with an option, so we have to use MutationObserver and jquery to change the css
  useEffect(() => {
    // Select the node that will be observed for mutations
    const targetNode = $('div.rcw-widget-container')[0]!;
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    function exists(selector: JQuery<HTMLElement>) {
      return $(selector).length > 0;
    }
    const callback: MutationCallback = (mutationList, observer) => {
      const conversationContainer = $('.rcw-conversation-container');
      const conversationResizer = $('.rcw-conversation-resizer');
      if (!exists(conversationResizer) && exists(conversationContainer)) {
        //we only add a resizer when there is no resizer and there is an active  conversation container
        const newContainer = $('<div>');
        newContainer.attr('class', 'rcw-conversation-resizer');
        conversationContainer.prepend(newContainer);
      } else {
        // if resizer exits we only add listeners to it when resizable is true
        let isDragging = false;
        let initialMouseX: number;
        let initialWidth: number;
        if (exists(conversationResizer)) {
          let handleMouseDown: (event: JQuery.MouseDownEvent) => void;
          let handleMouseMove: (event: JQuery.MouseMoveEvent) => void;
          let handleMouseUp: (event: JQuery.MouseUpEvent) => void;
          handleMouseDown = (event: JQuery.MouseDownEvent) => {
            isDragging = true;
            initialMouseX = event.clientX;
            initialWidth = parseInt(conversationContainer.css('width'), 10);
          };
          handleMouseMove = (event: JQuery.MouseMoveEvent) => {
            if (isDragging) {
              console.log(document);
              const mouseX = event.clientX;
              const widthDiff = mouseX - initialMouseX;
              conversationContainer.css(
                'width',
                `${initialWidth - widthDiff}px`
              );
            }
          };
          handleMouseUp = (event: JQuery.MouseUpEvent) => {
            isDragging = false;
          };
          conversationResizer.on('mousedown', handleMouseDown);
          $(document).on('mousemove', handleMouseMove);
          $(document).on('mouseup', handleMouseUp);
        }
      }
      if (exists($('section.emoji-mart'))) {
        $('section.emoji-mart').addClass(`emoji-mart emoji-mart-${theme}`);
      }
    };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    return () => {
      // Stop observing
      observer.disconnect();
      const conversationResizer = $('.rcw-conversation-resizer');
      if (exists(conversationResizer)) {
        const handleMouseDown = conversationResizer.data('handleMouseDown');
        const handleMouseMove = conversationResizer.data('handleMouseMove');
        const handleMouseUp = conversationResizer.data('handleMouseUp');
        conversationResizer.off('mousedown', handleMouseDown);
        $(document).off('mousemove', handleMouseMove);
        $(document).off('mouseup', handleMouseUp);
      }
    };
  }, []);

  return (
    <div className={theme}>
      <Widget
        title="OSS-GPT"
        subtitle={subtitle}
        emojis={true} // will be enabled after style is fine tuned for two themes
        handleNewUserMessage={handleNewUserMessage}
        showBadge={false}
        profileAvatar={chrome.runtime.getURL('main.png')}
      />
    </div>
  );
};

export default View;
