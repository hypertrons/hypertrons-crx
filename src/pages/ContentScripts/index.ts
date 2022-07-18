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
import DeveloperActiInflTrend from '../../anchors/DeveloperActInflTrend';
import RepoActiInflTrend from '../../anchors/RepoActiInflTrend';
import PerceptorTab from '../../anchors/PerceptorTab';
import PerceptorLayout from '../../anchors/PerceptorLayout';
import DeveloperNetwork from '../../anchors/DeveloperNetwork';
import ProjectNetwork from '../../anchors/ProjectNetwork';
import Hypertrons from '../../anchors/Hypertrons';
import { inject2Perceptor, Perceptor } from '../../anchors/Perceptor';
initializeIcons();
inject2Perceptor(DeveloperActiInflTrend);
inject2Perceptor(RepoActiInflTrend);

import { loadSettings } from '../../utils/settings';

import './content.styles.css';

// inject to Perceptor's static variable
inject2Perceptor(DeveloperActiInflTrend);
inject2Perceptor(RepoActiInflTrend);
inject2Perceptor(PerceptorTab);
inject2Perceptor(PerceptorLayout);
inject2Perceptor(DeveloperNetwork);
inject2Perceptor(ProjectNetwork);
inject2Perceptor(Hypertrons);

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
