const DOCS_GPT_ENDPOINT = 'https://oss-gpt.frankzhao.cn/api';

export const getAnswer = async (activeDocs: string, question: string) => {
  const response = await fetch(`${DOCS_GPT_ENDPOINT}/answer`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      active_docs: activeDocs,
      api_key: null,
      embeddings_key: null,
      history: '',
      question: question,
    }),
    mode: 'cors',
  });
  if (!response.ok) {
    return 'Oops, something went wrong.';
  } else {
    const data = await response.json();
    const anwser = data.answer;
    return anwser;
  }
};
