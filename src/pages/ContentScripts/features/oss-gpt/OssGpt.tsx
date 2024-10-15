import React, { useEffect, useState, useRef } from 'react';
import { ProChat, ProChatProvider, ProChatInstance, ChatItemProps, ChatMessage } from '@ant-design/pro-chat';
import { useTheme } from 'antd-style';
import { Button, Card, Form, Input } from 'antd';
import { getUsername } from '../../../../helpers/get-repo-info';
import { getResponse, convertChunkToJson } from './service';
import StarterList from './StarterList';
import ChatItemRender from './ChatItemRender';
import UserContent from './UserContent';
import LoadingStart from './LoadingStart';
import Markdown from './components/Markdown';
import type { FormProps } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { saveLLMInfo, getLLMInfo } from '../../../../helpers/LLM-info';
import { ChatOpenAI } from '@langchain/openai';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { useTranslation } from 'react-i18next';
import type { RunnableConfig } from '@langchain/core/runnables';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';
import '../../../../helpers/i18n';
interface FieldType {
  baseUrl: string;
  apiKey: string;
  modelName: string;
}
interface Props {
  githubTheme: 'light' | 'dark';
}
const Chat: React.FC<Props> = ({ githubTheme }) => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  const proChatRef = useRef<ProChatInstance>();
  const [complete, setComplete] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [llmInstance, setLLMInstance] = useState<any>(null);
  const [modelConfig, setModelConfig] = useState<any>(null);
  const theme = useTheme();
  const avatar = 'https://avatars.githubusercontent.com/u/57651122?s=200&v=4';
  const username = getUsername();
  const userAvatar = `https://github.com/${username}.png`;
  const title = '';
  const helloMessage = t('oss_gpt_hello_message');
  const starters = [t('oss_gpt_starters_introduce')];
  const sessionId = uuidv4();

  let memory = new ChatMessageHistory();
  const botInfo = {
    assistantMeta: {
      avatar: avatar,
      title: title,
    },
    helloMessage: helloMessage,
    starters: starters,
  };

  const testLLMInstance = async (config: any) => {
    const { baseUrl, apiKey, modelName } = config;
    const testLLM = new ChatOpenAI({
      apiKey,
      configuration: { baseURL: baseUrl },
      model: modelName,
      temperature: 0.95,
      maxRetries: 3,
    });
    try {
      const response = await testLLM.invoke([{ role: 'user', content: '1+1' }]);
      return response;
    } catch (error) {
      return null;
    }
  };
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    saveLLMInfo(values.baseUrl, values.apiKey, values.modelName);
    createLLMInstance(values);
    const testResponse = await testLLMInstance(values);
    if (testResponse == null) {
      setChats([
        ...chats,
        {
          content: t('oss_gpt_llm_info_error'),
          id: uuidv4(),
          role: 'assistant',
          avatar: avatar,
          title: '',
          updateAt: Date.now(),
          createAt: Date.now(),
        },
      ]);
    } else {
      setChats([]);
    }
  };
  const UserForm = (props: { name: string; gender: string; model: string }) => {
    return (
      <Card style={{ width: '400px', height: 'auto' }}>
        <Form
          onFinish={onFinish}
          initialValues={{
            baseUrl: modelConfig?.baseUrl,
            apiKey: modelConfig?.apiKey,
            modelName: modelConfig?.modelName,
          }}
        >
          <Form.Item
            label={t('oss_gpt_model_name')}
            name={'modelName'}
            rules={[{ required: true, message: t('oss_gpt_model_name_rule_message') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('oss_gpt_base_url')}
            name={'baseUrl'}
            rules={[{ required: true, message: t('oss_gpt_base_url_rule_message') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('oss_gpt_api_key')}
            name={'apiKey'}
            rules={[{ required: true, message: t('oss_gpt_api_key_rule_message') }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: '0' }}>
            <Button type="primary" htmlType="submit">
              {t('oss_gpt_llm_info_btn')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  };
  const createLLMInstance = (config: any) => {
    const { baseUrl, apiKey, modelName } = config;
    const model = new ChatOpenAI({
      apiKey,
      configuration: { baseURL: baseUrl },
      model: modelName,
      temperature: 0.95,
      maxRetries: 3,
    });
    setLLMInstance(model);
    setModelConfig(config);
  };

  useEffect(() => {
    const info = getLLMInfo();
    if (info.baseUrl && info.apiKey && info.modelName) {
      createLLMInstance(info);
    }
  }, []);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  return (
    <div style={{ background: theme.colorBgLayout, width: 540, height: 550 }}>
      <ProChat
        locale={i18n.language == 'en' ? 'en-US' : 'zh-CN'}
        chatRef={proChatRef}
        userMeta={{ avatar: userAvatar }}
        assistantMeta={{ avatar: avatar }}
        chats={chats}
        onChatsChange={(chat: ChatMessage[]) => {
          if (chat.length == 0) {
            memory = new ChatMessageHistory();
          }
        }}
        request={async (messages) => {
          if (!llmInstance) {
            setChats([
              {
                content: JSON.stringify({}),
                id: uuidv4(),
                role: 'user-form',
                avatar: avatar,
                title: '',
                updateAt: Date.now(),
                createAt: Date.now(),
              },
            ]);
            return;
          }
          try {
            const aiRunnableConfig: RunnableConfig = {
              configurable: {
                sessionId: sessionId,
              },
            };
            console.log();
            return await getResponse(messages.at(-1)?.content?.toString(), llmInstance, aiRunnableConfig, memory);
          } catch (error: any) {
            return error.message;
          }
        }}
        actions={{
          render: (defaultDoms) => {
            return [
              <a
                key="user"
                onClick={() => {
                  setChats([
                    {
                      content: JSON.stringify({}),
                      id: uuidv4(),
                      role: 'user-form',
                      avatar: avatar,
                      title: '',
                      updateAt: Date.now(),
                      createAt: Date.now(),
                    },
                  ]);
                }}
              >
                {t('oss_gpt_llm_switch')}
              </a>,
              ...defaultDoms,
            ];
          },
          flexConfig: {
            gap: 24,
            direction: 'horizontal',
            justify: 'space-between',
          },
        }}
        chatItemRenderConfig={{
          render: (
            props: ChatItemProps,
            domsMap: {
              avatar: React.ReactNode;
              title: React.ReactNode;
              messageContent: React.ReactNode;
              actions: React.ReactNode;
              itemDom: React.ReactNode;
            },
            defaultDom: React.ReactNode
          ): React.ReactNode => {
            const originData = props.originData || {};
            const isDefault = originData.role === 'hello';
            if (isDefault) {
              return (
                <ChatItemRender
                  direction={'start'}
                  title={title}
                  avatar={domsMap.avatar}
                  content={
                    <div className="leftMessageContent">
                      <div
                        className="ant-pro-chat-list-item-message-content"
                        style={{ background: githubTheme === 'light' ? '#ffffff' : '#2e2e2e' }}
                      >
                        <div className="text-left text-[20px] font-[500] leading-[28px] font-sf">
                          {botInfo.helloMessage}
                        </div>
                      </div>
                    </div>
                  }
                  starter={
                    <StarterList
                      starters={botInfo?.starters ?? starters ?? []}
                      onClick={(msg: string) => {
                        proChatRef?.current?.sendMessage(msg);
                      }}
                      className="ml-[72px]"
                    />
                  }
                />
              );
            }
            if (originData?.role === 'user-form') {
              return (
                <ChatItemRender
                  direction={'start'}
                  avatar={domsMap.avatar}
                  title={title}
                  content={
                    <div className="leftMessageContent">
                      <UserForm {...JSON.parse(originData?.content)} />
                    </div>
                  }
                />
              );
            }
            if (originData?.role === 'user') {
              try {
                const content = JSON.parse(originData.content) as string[];
                const { text } = content.reduce(
                  (acc, item) => {
                    acc.text += text;
                    return acc;
                  },
                  { text: '' }
                );
                return <ChatItemRender direction={'end'} title={domsMap.title} content={<UserContent text={text} />} />;
              } catch (err) {
                return defaultDom;
              }
            }
            const originMessage = convertChunkToJson(originData.content) as any;
            // Default message content
            const defaultMessageContent = <div className="leftMessageContent">{defaultDom}</div>;
            // If originMessage is invalid, return default message content
            if ((!originMessage || typeof originMessage === 'string') && !!proChatRef?.current?.getChatLoadingId()) {
              return (
                <ChatItemRender
                  direction={'start'}
                  avatar={domsMap.avatar}
                  title={title}
                  content={defaultMessageContent}
                />
              );
            }
            const { message: answerStr } = originMessage;
            // Handle chat loading state
            if (!!proChatRef?.current?.getChatLoadingId() && answerStr === '...') {
              return (
                <ChatItemRender
                  direction={'start'}
                  avatar={domsMap.avatar}
                  title={title}
                  content={
                    <div className="leftMessageContent">
                      <LoadingStart loop={!complete} onComplete={() => setComplete(true)} />
                    </div>
                  }
                />
              );
            }
            return (
              <ChatItemRender
                direction={'start'}
                avatar={domsMap.avatar}
                title={title}
                content={
                  <div className="leftMessageContent">
                    <Markdown
                      className="ant-pro-chat-list-item-message-content"
                      style={{
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        background: githubTheme === 'light' ? '#ffffff' : '#2e2e2e',
                      }}
                    >
                      {answerStr}
                    </Markdown>
                  </div>
                }
              />
            );
          },
        }}
      />
    </div>
  );
};
const OssGpt: React.FC<Props> = ({ githubTheme }) => (
  <ProChatProvider>
    <Chat githubTheme={githubTheme} />
  </ProChatProvider>
);
export default OssGpt;
