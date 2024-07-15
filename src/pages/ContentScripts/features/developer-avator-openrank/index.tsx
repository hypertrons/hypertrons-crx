import features from '../../../../feature-manager';

import { getOpenrank } from '../../../../api/developer';
import elementReady from 'element-ready';

const featureId = features.getFeatureID(import.meta.url);


const getData = async (developerName: string): Promise<string | null> => {
  const jsonData = await getOpenrank(developerName);
  if (!jsonData) return null;

  const keys = Object.keys(jsonData);
  if (keys.length === 0) return null;

  keys.sort(); // 按键排序，假设键是 ISO 日期格式
  const latestKey = keys[keys.length - 1];
  return jsonData[latestKey];
};

// 获取开发者名称的函数
const getDeveloperName = (target: HTMLElement): string | null => {
  const hovercardUrl = target.getAttribute('data-hovercard-url');
  if (!hovercardUrl) return null;

  // 假设 URL 格式为 /users/tyn1998/hovercard
  const matches = hovercardUrl.match(/\/users\/([^\/]+)\/hovercard/);
  return matches ? matches[1] : null;
};

// 初始化函数
const init = async (): Promise<void> => {
  // 监听具有 data-hovercard-type="user" 属性的元素
  document.querySelectorAll('[data-hovercard-type="user"]').forEach((element) => {
    element.addEventListener('mouseover', async () => {
      console.log('mouseover', element);

      // 获取开发者名称
      const developerName = getDeveloperName(element as HTMLElement);
      if (!developerName) {
        console.error('Developer name not found');
        return;
      }

      console.log("developerName", developerName);

      // 获取悬浮卡片容器
      const $popoverContainer = 'body > div.sr-only.mt-n1';
      const popover = await elementReady($popoverContainer, { stopOnDomReady: false });
      console.log("popover", popover);

      // 获取开发者的排名信息
      const openrank = await getData(developerName);
      if (openrank === null) {
        console.error('Rank data not found');
        return;
      }

      // 将 OpenRank 信息作为红色文本直接插入到悬浮卡片容器内容的前面
      if (popover) {
        popover.innerHTML = `OpenRank ${openrank} ` + popover.innerHTML;
      }
    });
  });
};

features.add(featureId, {
  awaitDomReady: false,
  init,
});
