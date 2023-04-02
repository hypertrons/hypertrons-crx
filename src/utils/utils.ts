import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import elementReady from 'element-ready';

import messages_en from '../locales/en/messages.json';
import messages_zh_CN from '../locales/zh_CN/messages.json';

const messages_locale = {
  en: messages_en,
  zh_CN: messages_zh_CN,
};

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

export const isPerceptor = (): boolean =>
  window.location.search.includes('?redirect=perceptor');

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
export async function isPublicRepo() {
  // another selector that also works
  // const repoLabel = $('strong[itemprop="name"]').siblings('span.Label.Label--secondary').text();
  await elementReady('#repository-container-header');
  const repoLabel = $('#repository-container-header')
    .find('span.Label.Label--secondary:first')
    .text();
  return (
    pageDetect.isRepo() &&
    (repoLabel === 'Public' || repoLabel === 'Public template')
  );
}

// https://dev.to/bwca/create-a-debounce-function-from-scratch-in-typescript-560m
export function debounce<A = unknown, R = void>(
  fn: (args: A) => R,
  ms: number
): [(args: A) => Promise<R>, () => void] {
  let timer: NodeJS.Timeout;

  const debouncedFunc = (args: A): Promise<R> =>
    new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });

  const teardown = () => clearTimeout(timer);

  return [debouncedFunc, teardown];
}

export function isAllNull(obj: Object) {
  return Object.values(obj).every((value) => value === null);
}
