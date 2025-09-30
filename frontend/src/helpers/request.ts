/**
 * @zh-CN 处理网络请求
 * @en-US network request
 */
const request = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw response.status;
  } else {
    return await response.json();
  }
};

export default request;
