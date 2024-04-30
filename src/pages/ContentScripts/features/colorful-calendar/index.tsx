import features from '../../../../feature-manager';

import * as pageDetect from 'github-url-detection';

const featureId = features.getFeatureID(import.meta.url);

const init = async (): Promise<void> => {
  console.log('init colorful-calendar');
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
