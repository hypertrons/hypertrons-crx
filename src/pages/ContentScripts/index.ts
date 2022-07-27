// content script lives in an isolated world, which means it
// cannot access to host page's javascript context such as
// adding an extra event handler to a registered event in host
// page. However, we can use injected scripts to run some code
// that can access to host page's context.
const injected = document.createElement('script');
injected.src = chrome.runtime.getURL('injectedScript.bundle.js');
console.log(injected);
injected.onload = function () {
  injected.remove(); // after the script run, it can be removed
};
(document.head || document.documentElement).appendChild(injected);

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

// inject to Perceptor's static variable
inject2Perceptor(DeveloperActiInflTrendAnchor);
inject2Perceptor(RepoActiInflTrendAnchor);
inject2Perceptor(PerceptorTabAnchor);
inject2Perceptor(PerceptorLayoutAnchor);
inject2Perceptor(DeveloperNetworkAnchor);
inject2Perceptor(ProjectNetworkAnchor);
inject2Perceptor(HypertronsAnchor);

async function mainInject() {
  const settings = await loadSettings();
  if (settings.isEnabled) {
    const perceptor = new Perceptor();
    perceptor.run();
  }
}

// if receive "turbo:load" from injected script, run mainInject()
window.addEventListener('message', function (event) {
  // Only accept messages from the same frame
  if (event.source !== window) return;
  if (event.data === 'turbo:load') {
    mainInject();
  }
});
