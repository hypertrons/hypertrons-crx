import features from '../../../../feature-manager';

import * as pageDetect from 'github-url-detection';

const featureId = features.getFeatureID(import.meta.url);

const init = async (): Promise<void> => {
  console.log('init colorful-calendar');
  const root = document.documentElement;
  root.style.setProperty('--color-calendar-graph-day-L1-bg', '#ffedf9');
  root.style.setProperty('--color-calendar-graph-day-L2-bg', '#ffc3eb');
  root.style.setProperty('--color-calendar-graph-day-L3-bg', '#ff3ebf');
  root.style.setProperty('--color-calendar-graph-day-L4-bg', '#c70085');
};

const restore = async () => {
  console.log('restore colorful-calendar');
};

features.add(featureId, {
  asLongAs: [pageDetect.isUserProfile],
  awaitDomReady: false,
  init,
  restore,
});
