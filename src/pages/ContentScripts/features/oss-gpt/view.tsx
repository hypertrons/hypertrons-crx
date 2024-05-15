import React, { useState, useEffect, useRef } from 'react';
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
import exists from '../../../../helpers/exists';
import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';

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

// Due to cost reasons, backend is not available now. This part can be removed when the backend is restored.
const backendNotAvailable = (locale: string) => {
  addResponseMessage(getMessageByLocale('OSS_GPT_errorMessage', locale));
};

const View = ({ theme, currentRepo, currentDocsName }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const [history, setHistory] = useState<[string, string]>(['', '']);
  const mouseDownX = useRef(0); // X position when mouse down
  const rcwWidth = useRef(0); // rcw width when mouse down

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

  const handleMouseDown = (event: JQuery.MouseDownEvent) => {
    mouseDownX.current = event.clientX;
    rcwWidth.current = parseInt(
      $('#rcw-conversation-container').css('width'),
      10
    );
    $(document).on('mousemove', handleMouseMove);
    $(document).on('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event: JQuery.MouseMoveEvent) => {
    $('#rcw-conversation-container').css(
      'width',
      `${rcwWidth.current - (event.clientX - mouseDownX.current)}px`
    );
  };

  const handleMouseUp = (event: JQuery.MouseUpEvent) => {
    $(document).off('mousemove', handleMouseMove);
    $(document).off('mouseup', handleMouseUp);
  };

  // we cannot change emoji-mart theme with an option, so we have to use MutationObserver and jquery to change the css
  useEffect(() => {
    // Select the node that will be observed for mutations
    const targetNode = $('div.rcw-widget-container')[0]!;
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    const callback: MutationCallback = (mutationList, observer) => {
      // hacking code for resizer
      if (
        !exists('.rcw-conversation-resizer') &&
        exists('.rcw-conversation-container')
      ) {
        //we only add a resizer when conversation container is active
        const resizerDiv = $('<div>');
        resizerDiv.attr('class', 'rcw-conversation-resizer');
        resizerDiv.on('mousedown', handleMouseDown);
        $('#rcw-conversation-container').prepend(resizerDiv);
      }
      // hacking code for emoji-mart
      if (exists('section.emoji-mart')) {
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
      if (answer == 'error') {
        backendNotAvailable(options.locale);
      } else {
        addResponseMessage(answer);
        setHistory([newMessage, answer]); // update history
      }
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
        handleNewUserMessage={handleNewUserMessage}
        showBadge={false}
        profileAvatar={chrome.runtime.getURL('main.png')}
      />
    </div>
  );
};

export default View;
