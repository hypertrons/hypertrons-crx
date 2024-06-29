import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import moment from 'moment';
import {
  Widget,
  addResponseMessage,
  deleteMessages,
  toggleMsgLoader,
  toggleInputDisabled,
  renderCustomComponent,
} from 'react-chat-widget';

import { getAnswer } from './service';
import './rcw.scss';
import exists from '../../../../helpers/exists';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
interface Props {
  theme: 'light' | 'dark';
  currentRepo: string;
  currentDocsName: string | null;
}

const ResponseTimeStamp: React.FC = () => {
  return <div style={{ fontSize: '11px', marginLeft: '50px' }}>{moment().format('LT')}</div>;
};

const UserTimeStamp: React.FC = () => {
  return <div style={{ fontSize: '11px', textAlign: 'right', width: '100%' }}>{moment().format('LT')}</div>;
};

const displayResponseMessage = (locale: string) => {
  addResponseMessage(locale);
  renderCustomComponent(ResponseTimeStamp, {});
};

const View = ({ theme, currentRepo, currentDocsName }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const [history, setHistory] = useState<[string, string]>(['', '']);
  const mouseDownX = useRef(0); // X position when mouse down
  const rcwWidth = useRef(0); // rcw width when mouse down
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  useEffect(() => {
    // when repo changes
    deleteMessages(Infinity); // delete all messages after repo switching
    setHistory(['', '']); // clear history
    if (currentDocsName) {
      // if docs for current repo is available
      displayResponseMessage(t('OSS_GPT_welcome', { repoName: currentRepo }));
    } else {
      displayResponseMessage(t('OSS_GPT_notAvailable', { repoName: currentRepo }));
    }
  }, [options, currentRepo, currentDocsName]);

  const handleMouseDown = (event: JQuery.MouseDownEvent) => {
    mouseDownX.current = event.clientX;
    rcwWidth.current = parseInt($('#rcw-conversation-container').css('width'), 10);
    $(document).on('mousemove', handleMouseMove);
    $(document).on('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event: JQuery.MouseMoveEvent) => {
    $('#rcw-conversation-container').css('width', `${rcwWidth.current - (event.clientX - mouseDownX.current)}px`);
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
      if (!exists('.rcw-conversation-resizer') && exists('.rcw-conversation-container')) {
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
    ? t('OSS_GPT_subtitle', { repoName: currentRepo })
    : t('OSS_GPT_subtitle_notAvailable', { repoName: currentRepo });

  const handleNewUserMessage = async (newMessage: string) => {
    renderCustomComponent(UserTimeStamp, {});
    toggleMsgLoader();
    toggleInputDisabled();

    if (currentDocsName) {
      const answer = await getAnswer(currentDocsName, newMessage, history);
      if (answer == 'error') {
        displayResponseMessage(t('OSS_GPT_errorMessage'));
      } else {
        addResponseMessage(answer);
        renderCustomComponent(ResponseTimeStamp, {});

        setHistory([newMessage, answer]); // update history
      }
    } else {
      displayResponseMessage(t('OSS_GPT_notAvailable', { repoName: currentRepo }));
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
        showTimeStamp={false}
      />
    </div>
  );
};

export default View;
