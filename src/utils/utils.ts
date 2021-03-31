import { developerData } from '../mock/developer.data';
import { projectData } from '../mock/project.data';

export function elementExists(obj: null | JQuery) {
  return obj !== null && obj.length > 0;
}

export function getMetaContent(index: any) {
  const ele = document.getElementsByTagName('meta')[index];
  if (ele && ele.content) {
    return ele.content;
  }
  return null;
}

export function isNull(object: any) {
  if (
    object === null ||
    typeof object === 'undefined' ||
    object === '' ||
    JSON.stringify(object) === '[]' ||
    JSON.stringify(object) === '{}'
  ) {
    return true;
  }
  return false;
}

export async function chromeSet(key: string, value: any) {
  const items: { [key: string]: any; } = {};
  items[key] = value;
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      resolve();
    })
  });
}

export async function chromeGet(key: string) {
  return new Promise<{ [key: string]: any; }>((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key]);
    })
  });
}

export function getMessageI18n(key: string) {
  return chrome.i18n.getMessage(key);
}

export const isPerceptor = (): boolean => window.location.search.includes('perceptor');

export const getGraphData = async (url: string) => {
  // const response = await fetch(url);
  // const data = await response.json();
  let data: any = {};
  if(url.includes('repo')){
    data = projectData;
  }else{
    data = developerData;
  }

  data.nodes.forEach((node: any) => {
    node['id'] = node.id.toString();
    node['symbolSize'] = node.value;
    node['itemStyle'] = {
      color: '#28a745'
    };
  });
  minMaxRange(data.nodes, 'symbolSize', 10, 50);
  data.edges.forEach((edge: any) => {
    edge['source'] = edge.source.toString();
    edge['target'] = edge.target.toString();
    edge['value'] = edge.weight;
  });
  minMaxRange(data.edges, 'weight', 1, 10);
  data.edges.forEach((edge: any) => {
    edge['lineStyle'] = {
      width: edge.weight,
      color: 'green'
    };
  });
  
  return data;
}

function getMaxV(data: any, key: string) {
  let max = 0;
  for (let item of data) {
    if (max < item[key])
      max = item[key]
  }
  return max
}

// 获取最小值
function getMinV(data: any, key: string) {
  let min = 1000000
  for (let item of data) {
    if (min > item[key])
      min = item[key]
  }
  return min
}

export const minMaxRange = (data: any, key: string, MIN: number, MAX: number) => {
  const min = getMinV(data, key);
  const max = getMaxV(data, key);
  for (let item of data) {
    item[key] = ((item[key] - min) / (1.0 * (max - min))) * (MAX - MIN) + MIN;
  }
  return data;
}
