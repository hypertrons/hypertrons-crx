const DOCS_GPT_ENDPOINT = 'https://oss-gpt.frankzhao.cn/api';

export const getAnswer = async (activeDocs: string, question: string, history: [string, string]) => {
  try {
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
        history: JSON.stringify(history),
        question,
      }),
      mode: 'cors',
    });
    if (!response.ok) {
      return 'Oops, something went wrong.';
    } else {
      const data = await response.json();
      const answer = data.answer;
      return answer;
    }
  } catch (error) {
    console.error('Error:', error);
    return 'error';
  }
};
