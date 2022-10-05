import $ from 'jquery';
import messages_en from '../locales/en/messages.json';
import messages_zh_CN from '../locales/zh_CN/messages.json';
import * as pageDetect from 'github-url-detection';

const messages_locale = {
  en: messages_en,
  zh_CN: messages_zh_CN,
};

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
  const items: { [key: string]: any } = {};
  items[key] = value;
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      resolve();
    });
  });
}

export async function chromeGet(key: string) {
  return new Promise<{ [key: string]: any }>((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key]);
    });
  });
}

export function getMessageByLocale(key: string, locale: string) {
  // @ts-ignore
  return messages_locale[locale][key]['message'];
}

export function getMessageI18n(key: string) {
  return chrome.i18n.getMessage(key);
}

export const isPerceptor = (): boolean =>
  window.location.search.includes('perceptor');

export const compareVersion = (version_1: string, version_2: string) => {
  const v1 = version_1.split('.');
  const v2 = version_2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num_1 = parseInt(v1[i]);
    const num_2 = parseInt(v2[i]);

    if (num_1 > num_2) {
      return 1;
    } else if (num_1 < num_2) {
      return -1;
    }
  }

  return 0;
};

export const getBrowserType = () => {
  var userAgent = navigator.userAgent;
  var isOpera = userAgent.indexOf('Opera') > -1;
  var isEdge = userAgent.indexOf('Edge') > -1;
  var isFF = userAgent.indexOf('Firefox') > -1;
  var isSafari =
    userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1;
  var isChrome =
    userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1;

  if (isOpera) {
    return 'Opera';
  } else if (isEdge) {
    return 'Edge';
  } else if (isFF) {
    return 'FireFox';
  } else if (isSafari) {
    return 'Safari';
  } else if (isChrome) {
    return 'Chrome';
  } else {
    return 'Unknown';
  }
};

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function runsWhen(rules: any[]) {
  return (constructor: Function) => {
    constructor.prototype.include = rules;
  };
}

export function getGithubTheme() {
  // following 3 variables are extracted from GitHub page's html tag properties
  // colorMode has 3 values: "auto", "light" and "dark"
  // lightTheme and darkTheme means "theme in day time" and "theme in night time" respectively
  const colorMode = $('[data-color-mode]')[0].dataset['colorMode'];
  const lightTheme = $('[data-light-theme]')[0].dataset['lightTheme'];
  const darkTheme = $('[data-dark-theme]')[0].dataset['darkTheme'];

  let githubTheme = colorMode;

  if (colorMode === 'auto') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      if (darkTheme?.startsWith('dark')) {
        githubTheme = 'dark';
      } else {
        githubTheme = 'light';
      }
    } else {
      if (lightTheme?.startsWith('dark')) {
        githubTheme = 'dark';
      } else {
        githubTheme = 'light';
      }
    }
  }

  return githubTheme;
}

export function getMinMax(data: INode[] | IEdge[]) {
  const newArr = data.map((item: INode | IEdge) => {
    return item.value;
  });
  return [Math.min(...newArr), Math.max(...newArr)];
}

export function linearMap(
  val: number,
  domain: number[],
  range: number[]
): number {
  const d0 = domain[0];
  const d1 = domain[1];
  const r0 = range[0];
  const r1 = range[1];

  const subDomain = d1 - d0;
  const subRange = r1 - r0;

  if (subDomain === 0) {
    return subRange === 0 ? r0 : (r0 + r1) / 2;
  }
  if (subDomain > 0) {
    if (val <= d0) {
      return r0;
    } else if (val >= d1) {
      return r1;
    }
  } else {
    if (val >= d0) {
      return r0;
    } else if (val <= d1) {
      return r1;
    }
  }

  return ((val - d0) / subDomain) * subRange + r0;
}

// check if the repository is public
export function isPublicRepo() {
  const repoLabel = $('#repository-container-header')
    .find("span.Label.Label--secondary")
    .text();
    
  return (
    pageDetect.isRepo() &&
    (repoLabel === 'Public' || repoLabel === 'Public template')
  );
}
