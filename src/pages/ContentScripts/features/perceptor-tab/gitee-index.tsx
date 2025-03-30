import elementReady from 'element-ready';
import iconSvgPath from './icon-svg-path';
import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { isPublicRepoWithMeta } from '../../../../helpers/get-gitee-repo-info';
import isGitee from '../../../../helpers/is-gitee';

const featureId = features.getFeatureID(import.meta.url);

const addPerceptorTab = async (): Promise<void | false> => {
  // Wait for the secondary navigation menu to load
  const menuContainer = await elementReady('.ui.secondary.pointing.menu', { waitForChildren: false });
  if (!menuContainer) {
    return false;
  }

  // Create the Perceptor tab based on the pipeline tab
  const pipelineTab = await elementReady('a.item[href*="/gitee_go"]', { waitForChildren: false });
  if (!pipelineTab) {
    return false;
  }

  const perceptorTab = pipelineTab.cloneNode(true) as HTMLAnchorElement;
  perceptorTab.classList.remove('active');
  const perceptorHref = `${location.pathname}?redirect=perceptor`;
  perceptorTab.href = perceptorHref;
  perceptorTab.id = featureId;

  // Replace the icon and text
  const iconElement = perceptorTab.querySelector('i.iconfont') as HTMLElement;
  if (iconElement) {
    iconElement.className = 'iconfont';
    iconElement.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" style="margin-right: 4px">${iconSvgPath}</svg>`;
  }

  // Clear existing text nodes
  perceptorTab.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.remove();
    }
  });

  // Add new text node
  const textNode = document.createTextNode('\nPerceptor\n');
  iconElement?.after(textNode);

  // Add the Perceptor tab before the service dropdown
  const serviceDropdown = menuContainer.querySelector('.git-project-service');
  if (!serviceDropdown) {
    console.error('Failed to find the service dropdown');
    return false;
  }
  serviceDropdown.parentElement?.before(perceptorTab);
};

const updatePerceptorTabHighlighting = async (): Promise<void> => {
  const perceptorTab = document.getElementById(featureId) as HTMLAnchorElement;
  if (!perceptorTab) return;

  const allTabs = document.querySelectorAll('.ui.secondary.pointing.menu a.item');
  allTabs.forEach((tab) => tab.classList.remove('active'));
  perceptorTab.classList.add('active');
};

const init = async (): Promise<void> => {
  await addPerceptorTab();
  if (isPerceptor()) {
    await updatePerceptorTabHighlighting();
  }
};

features.add(featureId, {
  asLongAs: [isGitee, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
});
