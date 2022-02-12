const ENV = require('../../utils/env');
import { ErrorCode, API_TARGET } from '../constant';

/**
 * @zh-CN 处理网络请求
 * @en-US network request
 */
const request = async (path: string) => {
  const url = new URL(path, API_TARGET);
  const response = await fetch(url.href);
  if (!response.ok) {
    throw ErrorCode.NOT_FOUND
  }
  const data = await response.json();
  return {
    status: response.status,
    statusText: response.statusText,
    data
  };
}

export const mockSuccessRes = (data: any) => {
  if (!ENV.MOCK) {
    return null;
  }
  return {
    status: 200,
    statusText: 'ok',
    data: data,
  };
}

export default request;
