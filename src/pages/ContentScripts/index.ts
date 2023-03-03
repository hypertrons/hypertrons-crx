import './index.scss';

import './features/repo-activity-openrank-trends';
import './features/developer-activity-openrank-trends';
import './features/repo-fork-tooltip';
import './features/repo-star-tooltip';

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
