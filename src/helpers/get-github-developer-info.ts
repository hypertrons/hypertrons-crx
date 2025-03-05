import { metaStore } from '../api/common';

import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { getPlatform } from './get-platform';

export function getDeveloperName() {
  const developerNameByUrl = getDeveloperNameByUrl();
  const developerNameByPage = getDeveloperNameByPage();
  if (developerNameByUrl.toLowerCase() === developerNameByPage.toLowerCase()) {
    return developerNameByPage;
  }
  return developerNameByUrl;
}

export function getDeveloperNameByPage() {
  return $('.p-nickname.vcard-username.d-block').text().trim().split(' ')[0];
}
export function getDeveloperNameByUrl() {
  const currentUrl = window.location.href;
  const parsedUrl = new URL(currentUrl);
  const pathParts = parsedUrl.pathname.split('/');
  const developerName = pathParts[pathParts.length - 1];
  return developerName;
}
export async function isDeveloperWithMeta() {
  const platform = getPlatform();
  if (platform === 'unknown') {
    return false;
  }
  return pageDetect.isUserProfile() && (await metaStore.has(platform, getDeveloperName()));
}
export async function isUserProfile() {
  return pageDetect.isUserProfile();
}
export function checkLogined() {
  return !!$('meta[name="user-login"]').attr('content');
}
