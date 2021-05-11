const API_TARGET = 'http://hypertrons-oss.x-lab.info'

/**
 * @zh-CN 处理网络请求
 * @en-US network request
 * 
 * TODO: Exception handler
 */
const request = async (path: string) => {
  const url = new URL(path, API_TARGET);

  const response = await fetch(url.href);
  if (!response.ok) {
    console.error(
      '❌ Perceptor : Error occured when request to ', url,
      ', error response: ', response
    );
  }
  const data = await response.json();
  return {
    status: response.status,
    statusText: response.statusText,
    data
  };
}

export default request;