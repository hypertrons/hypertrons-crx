import features from '../../../../feature-manager';
import { getOpenrank } from '../../../../api/developer';
import elementReady from 'element-ready';

const featureId = features.getFeatureID(import.meta.url);

const getData = async (developerName: string): Promise<string | null> => {
  const data = await getOpenrank(developerName);
  if (data) {
    const keys = Object.keys(data);
    const latestKey = keys[keys.length - 1];
    return data[latestKey];
  }
  return null;
};

const getDeveloperName = (target: HTMLElement): string | null => {
  const hovercardUrl = target.getAttribute('data-hovercard-url');
  if (!hovercardUrl) return null;

  const matches = hovercardUrl.match(/\/users\/([^\/]+)\/hovercard/);
  return matches ? matches[1] : null;
};

const init = async (): Promise<void> => {
  // 监听具有 data-hovercard-type="user" 属性的元素
  document.querySelectorAll('[data-hovercard-type="user"]').forEach((element) => {
    element.addEventListener('mouseover', async () => {
      // 获取开发者名称
      const developerName = getDeveloperName(element as HTMLElement);
      if (!developerName) {
        console.error('Developer name not found');
        return;
      }

      // 获取开发者的排名信息
      const openrank = await getData(developerName);
      if (openrank === null) {
        console.error('Rank data not found');
        return;
      }

      // 获取悬浮卡片容器
      const $popoverContainer =
        'body > div.logged-in.env-production.page-responsive > div.Popover.js-hovercard-content.position-absolute > div > div > div';
      const popover = await elementReady($popoverContainer, { stopOnDomReady: false });

      // 检查是否已经插入了 OpenRank 信息
      if (popover && !popover.querySelector('.openrank-info')) {
        // 将 OpenRank 信息作为红色文本直接插入到悬浮卡片容器内容的前面
        const openRankDiv = document.createElement('div');
        openRankDiv.classList.add('openrank-info');
        openRankDiv.style.color = 'black';
        openRankDiv.textContent = ` OpenRank ${openrank} `;
        popover.appendChild(openRankDiv);
      } else {
        console.error('OpenRank info already inserted');
      }
    });
  });
};

features.add(featureId, {
  awaitDomReady: false,
  init,
});
