import $ from 'jquery';

export function getDeveloperName() {
  return $('.p-nickname.vcard-username.d-block').text().trim().split(' ')[0];
}
