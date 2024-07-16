import features from '../../../../feature-manager';
import { getOpenrank } from '../../../../api/developer';
import elementReady from 'element-ready';

const featureId = features.getFeatureID(import.meta.url);

const getData = async (developerName: string): Promise<string | null> => {
  const jsonData = await getOpenrank(developerName);
  if (!jsonData) return null;

  const keys = Object.keys(jsonData);
  if (keys.length === 0) return null;

  keys.sort(); // 假设键是按时间顺序排列的
  const latestKey = keys[keys.length - 1];
  return jsonData[latestKey];
};

const getDeveloperName = (target: HTMLElement): string | null => {
  const hovercardUrl = target.getAttribute('data-hovercard-url');
  if (!hovercardUrl) return null;

  const matches = hovercardUrl.match(/\/users\/([^\/]+)\/hovercard/);
  return matches ? matches[1] : null;
};

const createTooltip = (text: string): HTMLDivElement => {
  const tooltip = document.createElement('div');
  tooltip.id = 'openrank-tooltip';
  tooltip.style.position = 'absolute';
  tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  tooltip.style.color = 'white';
  tooltip.style.padding = '5px 10px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.zIndex = '1000';
  tooltip.style.pointerEvents = 'none'; // 避免阻挡鼠标事件
  tooltip.innerText = text;
  document.body.appendChild(tooltip);
  return tooltip;
};

const init = async (): Promise<void> => {
  // 函数来处理鼠标悬停事件
  const handleMouseOver = async (element: HTMLElement, event: MouseEvent) => {
    const developerName = getDeveloperName(element);
    if (!developerName) {
      console.error('Developer name not found');
      return;
    }

    console.log('Developer Name:', developerName);

    const openrank = await getData(developerName);
    if (openrank === null) {
      console.error('Rank data not found');
      return;
    }

    const openrankText = `OpenRank ${openrank}`;
    let tooltip = document.getElementById('openrank-tooltip') as HTMLDivElement;

    if (!tooltip) {
      tooltip = createTooltip(openrankText);
    } else {
      tooltip.innerText = openrankText;
    }

    const updateTooltipPosition = (e: MouseEvent) => {
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      const offsetX = 15;
      const offsetY = 15;

      let left = e.clientX + offsetX + window.scrollX;
      let top = e.clientY + offsetY + window.scrollY;

      // Check if the tooltip goes beyond the right edge of the viewport
      if (left + tooltipWidth > window.innerWidth + window.scrollX) {
        left = e.clientX - tooltipWidth - offsetX + window.scrollX;
      }

      // Check if the tooltip goes beyond the bottom edge of the viewport
      if (top + tooltipHeight > window.innerHeight + window.scrollY) {
        top = e.clientY - tooltipHeight - offsetY + window.scrollY;
      }

      // Ensure tooltip doesn't go beyond the left edge of the viewport
      if (left < window.scrollX) {
        left = window.scrollX;
      }

      // Ensure tooltip doesn't go beyond the top edge of the viewport
      if (top < window.scrollY) {
        top = window.scrollY;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    updateTooltipPosition(event);
    const mouseMoveHandler = updateTooltipPosition as EventListener;
    element.addEventListener('mousemove', mouseMoveHandler);

    element.addEventListener(
      'mouseout',
      () => {
        if (tooltip) {
          tooltip.remove();
        }
        element.removeEventListener('mousemove', mouseMoveHandler);
      },
      { once: true }
    );
  };

  const bindEventListeners = () => {
    document.querySelectorAll('[data-hovercard-type="user"]').forEach((element) => {
      if (!element.getAttribute('data-openrank-bound')) {
        element.setAttribute('data-openrank-bound', 'true');
        element.addEventListener('mouseover', (event) => handleMouseOver(element as HTMLElement, event as MouseEvent));
      }
    });
  };

  // 初始绑定
  bindEventListeners();

  // 观察 DOM 变化，动态为新添加的元素绑定事件
  const observer = new MutationObserver(() => {
    bindEventListeners();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

features.add(featureId, {
  awaitDomReady: false,
  init,
});
