import features from '../../../../feature-manager';

import { getOpenrank } from '../../../../api/developer';

const featureId = features.getFeatureID(import.meta.url);

const getData = async (developerName: string): Promise<string | null> => {
  return await getOpenrank(developerName);
};

const getDeveloperName = (target: HTMLElement): string | null => {
  if (!target) return null;
  // 假设需要从容器的内容中获取第一个单词作为开发者名称
  const containerText = target.textContent?.trim();
  if (!containerText) return null;
  return containerText.split(' ')[0];
};

// 初始化函数
const init = async (): Promise<void> => {
  document.addEventListener('mouseover', async (event) => {
    const target = event.target as HTMLElement;

    // 检查是否悬停在 id 为 js-global-screen-reader-notice 的容器上
    if (target.id === 'js-global-screen-reader-notice') {
      // 获取开发者名称
      const developerName = getDeveloperName(target);
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

      // 创建新的 HTML 元素
      const para = document.createElement('p');
      para.id = 'current-developer-openrank';
      para.innerHTML = `OpenRank ${openrank}`;
      para.style.color = 'red';

      // 将新创建的元素插入到容器内容的前面
      target.insertBefore(para, target.firstChild);
    }
  });
};

features.add(featureId, {
  awaitDomReady: false,
  init,
});
