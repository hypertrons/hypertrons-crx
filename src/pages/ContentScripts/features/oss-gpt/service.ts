import { forEach } from 'lodash';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import type { RunnableConfig } from '@langchain/core/runnables';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';
export const handleStream = async (stream: any) => {
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        try {
          const chunkText = chunk.content;
          controller.enqueue(encoder.encode(chunkText));
        } catch (err) {
          controller.error(err);
        }
      }
      controller.close();
    },
  });
  return new Response(readableStream);
};
export const convertChunkToJson = (rawData: string) => {
  const messages: string[] = [];
  forEach(rawData, (chunk) => {
    messages.push(chunk);
  });
  // final message
  return { message: messages.join('') };
};
export const getResponse = async (
  messages: any,
  model: any,
  aiRunnableConfig: RunnableConfig,
  memory: ChatMessageHistory
) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are an intelligent question answering robot from x-lab laboratory on the GitHub platform. Your feature is GitHub related Q&A.'],
    new MessagesPlaceholder('chat_history'),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
  ]);

  const chain = prompt.pipe(model);
  const chainWithMessageHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: (_sessionId) => memory,
    inputMessagesKey: 'input',
    historyMessagesKey: 'chat_history',
  });

  const responseStream = await chainWithMessageHistory.stream({ input: messages }, aiRunnableConfig);
  return handleStream(responseStream);
};
