import { metaStore } from '../api/common';

import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

export function getDeveloperName() {
  return $('.p-nickname.vcard-username.d-block').text().trim().split(' ')[0];
}

export async function isDeveloperWithMeta() {
  return pageDetect.isUserProfile() && (await metaStore.has(getDeveloperName()));
}

export function checkLogined() {
  return !!$('meta[name="user-login"]').attr('content');
}
