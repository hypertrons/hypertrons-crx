import features from '../../../../feature-manager';

import { getOpenrank } from '../../../../api/developer';

const featureId = features.getFeatureID(import.meta.url);

const getData = async (developerName: string): Promise<string | null> => {
  return await getOpenrank(developerName);
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
// 初始化函数
const init = async (): Promise<void> => {
  // 监听全局鼠标悬停事件
  document.onmouseover = async (event) => {
    const target = event.target as HTMLElement;

    console.log('target:', target.id);

    // 检查是否悬停在 img 元素或其最近的父元素上
    let elementWithHovercard: HTMLElement | null = null;

    if (target.tagName === 'img' && target.hasAttribute('data-hovercard-type')) {
      elementWithHovercard = target;
    } else {
      elementWithHovercard = target.closest('[data-hovercard-type]');
    }

    if (elementWithHovercard) {
      // 获取开发者名称
      const developerName = getDeveloperName(elementWithHovercard);
      if (!developerName) {
        console.error('Developer name not found');
        return;
      }

      // 获取 js-global-screen-reader-notice 容器
      const noticeContainer = document.getElementById('js-global-screen-reader-notice');
      if (!noticeContainer) {
        console.error('Notice container not found');
        return;
      }

      // 获取开发者的排名信息
      const openrank = await getData(developerName);
      if (openrank === null) {
        console.error('Rank data not found');
        return;
      }

      // 创建新的 HTML 元素
      const para = document.createElement('p');
      para.id = 'current-developer-openrank';
      para.innerHTML = `OpenRank ${openrank}`;
      para.style.color = 'red';

      // 将新创建的元素插入到容器内容的前面
      noticeContainer.insertBefore(para, noticeContainer.firstChild);
    }
  };
};

features.add(featureId, {
  awaitDomReady: false,
  init,
});
