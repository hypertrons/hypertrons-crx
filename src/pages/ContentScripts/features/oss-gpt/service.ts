import { forEach } from 'lodash';
import { ChatPromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
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
export const getResponse = async (messages: any, model: any) => {
  const prompt = ChatPromptTemplate.fromMessages([HumanMessagePromptTemplate.fromTemplate('{input}')].filter(Boolean));
  const chain = prompt.pipe(model);
  const basePrompt = '你是来自x-lab实验室的围绕GitHub平台的智能问答机器人';
  const responseStream = await chain.stream({ input: basePrompt + messages });
  return handleStream(responseStream);
};
