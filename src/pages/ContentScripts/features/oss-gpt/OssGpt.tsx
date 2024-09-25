import React, { useEffect, useState, useRef } from 'react';
import { ProChat, ProChatProvider, ProChatInstance, ChatItemProps } from '@ant-design/pro-chat';
import { useTheme, ThemeProvider } from 'antd-style';
import { Button, Card, Form, Input, theme } from 'antd';
import { getUsername } from '../../../../helpers/get-repo-info';
import { getResponse, convertChunkToJson } from './service';
import StarterList from './StarterList';
import ChatItemRender from './ChatItemRender';
import UserContent from './UserContent';
import LoadingStart from './LoadingStart';
import LoadingEnd from './LoadingEnd';
import Markdown from './components/Markdown';
import type { FormProps } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { saveLLMInfo, getLLMInfo } from '../../../../helpers/LLM-info';
import { ChatOpenAI } from '@langchain/openai';
type FieldType = {
  baseUrl: string;
  apiKey: string;
  modelName: string;
};

const Chat: React.FC = () => {
  const proChatRef = useRef<ProChatInstance>();
  const [complete, setComplete] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [llmInstance, setLLMInstance] = useState<any>(null); // 保存 LLM 实例
  const [modelConfig, setModelConfig] = useState<any>(null);
  const theme = useTheme();
  const username = getUsername();
  const avatar = 'https://avatars.githubusercontent.com/u/57651122?s=200&v=4';
  const title = '';
  const helloMessage = '';
  // const starters:string[]=[]
  const starters = ['你好', '介绍一下'];
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
      configuration: { baseURL: baseUrl, fetch },
      model: modelName,
      temperature: 0.95,
      maxRetries: 3,
    });

    try {
      const response = await testLLM.invoke([{ role: 'user', content: '你好' }]);
      return response; // 返回模型的回答
    } catch (error) {
      return null;
    }
  };
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    saveLLMInfo(values.baseUrl, values.apiKey, values.modelName);
    setModelConfig(values);
    createLLMInstance(values);

    const testResponse = await testLLMInstance(values);
    if (testResponse == null) {
      setChats([
        ...chats,
        {
          content: '配置信息有误，请再次确认，输入正确的信息',
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
            label="模型名称"
            name={'modelName'}
            rules={[{ required: true, message: 'Please input your modelName!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="接口路径"
            name={'baseUrl'}
            rules={[{ required: true, message: 'Please input your baseUrl!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密钥配置"
            name={'apiKey'}
            rules={[{ required: true, message: 'Please input your apiKey!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: '0' }}>
            <Button type="primary" htmlType="submit">
              确认
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
      configuration: { baseURL: baseUrl, fetch },
      model: modelName,
      temperature: 0.95,
      maxRetries: 3,
    });
    setLLMInstance(model);
    setModelConfig(config);
  };
  useEffect(() => {
    // 在组件加载时检查并创建 LLM 实例
    const info = getLLMInfo();
    if (info.baseUrl && info.apiKey && info.modelName) {
      createLLMInstance(info);
    }
  }, []);
  return (
    <div style={{ background: theme.colorBgLayout, width: 500, height: 550 }}>
      <ProChat
        locale="en-US"
        chatRef={proChatRef}
        userMeta={{ avatar: `https://github.com/${username}.png` }}
        assistantMeta={{ avatar: avatar }}
        helloMessage=""
        chats={chats}
        request={async (messages) => {
          if (!llmInstance) {
            // 插入一条消息，提示用户先填写配置信息
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
            return await getResponse(messages.at(-1)?.content?.toString(), llmInstance);
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
                  console.log;
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
                选择模型
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
                  title={domsMap.title}
                  avatar={domsMap.avatar}
                  content={
                    <div className="leftMessageContent">
                      <div className="ant-pro-chat-list-item-message-content">
                        <div className="text-left text-[20px] font-[500] leading-[28px] font-sf">
                          Hello！
                          {botInfo.assistantMeta?.title}
                        </div>
                        <div className="text-left text-[14px] font-[500] leading-[28px] font-sf">{props.message}</div>
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
                  title={domsMap.title}
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
                  title={domsMap.title}
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
                title={domsMap.title}
                content={
                  <div className="leftMessageContent">
                    <LoadingEnd>
                      <Markdown
                        className="ant-pro-chat-list-item-message-content"
                        style={{ overflowX: 'hidden', overflowY: 'auto' }}
                      >
                        {answerStr}
                      </Markdown>
                    </LoadingEnd>
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
const OssGpt: React.FC = () => (
  <ProChatProvider>
    <Chat />
  </ProChatProvider>
);
export default OssGpt;
