import { getUpdateInfor } from './background';
import { getBrowserType } from '../utils/utils';

export const checkUpdate = async () => {
  const currentVersion = (await chrome.management.getSelf()).version;
  const browserType = getBrowserType();
  const updateInformation = await getUpdateInfor();
  let latestVersion;
  let updateUrl;

  if (chrome.runtime.getManifest().key) {
    // the store-version installation
    if (browserType === 'Edge') {
      latestVersion = updateInformation['edge']['latest_version'];
      updateUrl = updateInformation['edge']['url'];
      // edge can also install crx from chrome store
      if ((await chrome.management.getSelf()).updateUrl) {
        const update_url = (await chrome.management.getSelf()).updateUrl;
        if (update_url!.search('google') !== -1) {
          latestVersion = updateInformation['chrome']['latest_version'];
          updateUrl = updateInformation['chrome']['url'];
        }
      }
    } else {
      latestVersion = updateInformation['chrome']['latest_version'];
      updateUrl = updateInformation['chrome']['url'];
    }
  } else {
    latestVersion = updateInformation['develop']['latest_version'];
    updateUrl = updateInformation['develop']['url'];
  }
  return [currentVersion, latestVersion, updateUrl];
};

export const checkIsTokenAvailabe = async (token: string) => {
  const response = await fetch(`https://api.github.com/user`, {
    headers: { Authorization: `token ${token}` },
  });
  return await response.json();
};
