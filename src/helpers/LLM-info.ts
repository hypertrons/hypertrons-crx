export const saveLLMInfo = (baseUrl: string, apiKey: string, modelName: string) => {
  localStorage.setItem('baseUrl', baseUrl);
  localStorage.setItem('apiKey', apiKey);
  localStorage.setItem('modelName', modelName);
};
export const getLLMInfo = () => {
  const baseUrl = localStorage.getItem('baseUrl') || '';
  const apiKey = localStorage.getItem('apiKey') || '';
  const modelName = localStorage.getItem('modelName') || '';
  return {
    baseUrl,
    apiKey,
    modelName,
  };
};
