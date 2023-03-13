import React from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import { getGithubTheme } from '../../utils/utils';

const githubTheme = getGithubTheme();

const DOCS_GPT_ENDPOINT = 'https://oss-gpt.frankzhao.cn/api';

const handleNewUserMessage = async (newMessage: string) => {
  // Now send the message throught the backend API
  const response = await fetch(`${DOCS_GPT_ENDPOINT}/answer`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      active_docs: 'opendigger',
      api_key: null,
      embeddings_key: null,
      history: '',
      question: newMessage,
    }),
    mode: 'cors',
  });
  if (!response.ok) {
    throw response.status;
  } else {
    const data = await response.json();
    addResponseMessage(data.answer);
  }
};

const View = ({ currentRepo }: { currentRepo: string }): JSX.Element => {
  return (
    <Widget
      title="OSS-GPT"
      subtitle={`Ask anything about ${currentRepo}`}
      emojis={true}
      handleNewUserMessage={handleNewUserMessage}
    />
  );
};

export default View;
