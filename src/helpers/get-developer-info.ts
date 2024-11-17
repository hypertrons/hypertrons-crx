import { metaStore } from '../api/common';

import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

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
  return pageDetect.utils.getUsername()!;
}

export async function isDeveloperWithMeta(platform: string) {
  return pageDetect.isUserProfile() && (await metaStore.has(platform, getDeveloperName()));
}
export async function isUserProfile() {
  return pageDetect.isUserProfile();
}
export function checkLogined() {
  return !!$('meta[name="user-login"]').attr('content');
}
