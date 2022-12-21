// @ts-ignore
import { ErrorCode } from '../constant';

/**
 * @zh-CN 处理网络请求
 * @en-US network request
 */
const request = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw ErrorCode.NOT_FOUND;
  }
  const data = await response.json();
  return {
    status: response.status,
    statusText: response.statusText,
    data,
  };
};

export default request;
