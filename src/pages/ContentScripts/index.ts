// initializeIcons() should only be called once per app and must be called before rendering any components.
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();

import DeveloperActiInflTrendAnchor from '../../anchors/DeveloperActInflTrendAnchor';
import RepoActiInflTrendAnchor from '../../anchors/RepoActiInflTrendAnchor';
import PerceptorTabAnchor from '../../anchors/PerceptorTabAnchor';
import PerceptorLayoutAnchor from '../../anchors/PerceptorLayoutAnchor';
import DeveloperNetworkAnchor from '../../anchors/DeveloperNetworkAnchor';
import ProjectNetworkAnchor from '../../anchors/ProjectNetworkAnchor';
import HypertronsAnchor from '../../anchors/HypertronsAnchor';
import { inject2Perceptor, Perceptor } from '../../Perceptor';

import { loadSettings } from '../../utils/settings';

import './index.css';
import DynamicRacingBarAnchor from '../../anchors/DynamicRacingBarAnchor';
import HorizontalBannerAnchor from '../../anchors/HorizontalBanner';

// inject to Perceptor's static variable
inject2Perceptor(DeveloperActiInflTrendAnchor);
inject2Perceptor(RepoActiInflTrendAnchor);
inject2Perceptor(PerceptorTabAnchor);
inject2Perceptor(PerceptorLayoutAnchor);
inject2Perceptor(DeveloperNetworkAnchor);
inject2Perceptor(ProjectNetworkAnchor);
inject2Perceptor(HypertronsAnchor);
inject2Perceptor(DynamicRacingBarAnchor);
inject2Perceptor(HorizontalBannerAnchor)

async function mainInject() {
  const settings = await loadSettings();
  if (settings.isEnabled) {
    const perceptor = new Perceptor();
    perceptor.run();
  }
}

document.addEventListener('turbo:load', () => {
  mainInject();
});

/**
 * I infer that GitHub uses hotwired/turbo to speedup its SPA.
 * Fortunately there are some events to hook our code in GitHub
 * life cycle. See: https://turbo.hotwired.dev/reference/events
 *
 * FluentUI is a css-in-js UI library, all styles are dynamicly
 * computed and injected to several style tags, like:
 *
 * <head>
 *   <style data-merge-styles="true"></style>
 *   <style data-merge-styles="true"></style>
 *   <style data-merge-styles="true"></style>
 * </head>
 *
 * Thease tags are only computed once for each component. But the
 * style tags are regarded as "provisional elements" by turbo and
 * most of them will be removed after each trubo:visit, leading to
 * style crash.
 *
 * After reading the source code of turbo, I figure out a workaround.
 * By adding an id to all <style data-merge-styles="true"></style>
 * to make their outerHtml not be same, turbo will not regard them
 * as provisional elements and will keep them in headers.
 */

document.addEventListener('turbo:before-visit', () => {
  [...document.getElementsByTagName('style')].forEach((element, index) => {
    if (element.hasAttribute('data-merge-styles')) {
      element.setAttribute('data-id', index + '');
    }
  });
});
