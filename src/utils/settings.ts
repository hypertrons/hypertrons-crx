import { chromeGet, isNull } from './utils';

class Settings {
  isEnabled: boolean | undefined;
  checkForUpdates: boolean | undefined;
  developerNetwork: boolean | undefined;
  projectNetwork: boolean | undefined;
  locale: string;

  constructor() {
    this.isEnabled = true;
    this.checkForUpdates = true;
    this.developerNetwork = true;
    this.projectNetwork = true;
    const language = chrome.i18n.getUILanguage();
    if (language.startsWith('zh')) {
      this.locale = 'zh_CN';
    } else {
      this.locale = 'en';
    }
  }

  loadFromJson(data: { [key: string]: any }): void {
    if ('isEnabled' in data) {
      this.isEnabled = data['isEnabled'];
    }
    if ('checkForUpdates' in data) {
      this.checkForUpdates = data['checkForUpdates'];
    }
    if ('developerNetwork' in data) {
      this.developerNetwork = data['developerNetwork'];
    }
    if ('projectNetwork' in data) {
      this.projectNetwork = data['projectNetwork'];
    }
    if ('locale' in data) {
      this.locale = data['locale'];
    }
  }

  toJson(): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    result['isEnabled'] = this.isEnabled;
    result['checkForUpdates'] = this.checkForUpdates;
    result['developerNetwork'] = this.developerNetwork;
    result['projectNetwork'] = this.projectNetwork;
    result['locale'] = this.locale;
    return result;
  }
}

export const loadSettings = async () => {
  const settings = new Settings();
  let obj = await chromeGet('settings');
  if (isNull(obj)) {
    obj = {};
  }
  settings.loadFromJson(obj);
  return settings;
};

export default Settings;
