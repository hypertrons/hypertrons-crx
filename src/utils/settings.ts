// settings.ts
// load and save settings through chromeGet and chromeSet
// all features should load settings first
import { chromeGet, chromeSet, isNull } from './utils';

export interface FeatureOption {
  id: FeatureID;
  isEnabled: boolean;
}

export interface Settings {
  isEnabled: boolean | undefined;
  featureOptions: FeatureOption[];
  locale: string;
}

export async function loadSettings() {
  let settingsConfig = await chromeGet('settings');
  if (isNull(settingsConfig)) {
    settingsConfig = {};
  }
  return {
    isEnabled: settingsConfig['isEnabled'],
    featureOptions: JSON.parse(settingsConfig['featureOptions']),
    locale: settingsConfig['locale'],
  };
}

export const defaultSettings: Settings = {
  isEnabled: true,
  featureOptions: [],
  locale: 'en',
};

export const saveSettings = async (settings: Settings) => {
  await chromeSet('settings', {
    isEnabled: settings.isEnabled,
    featureOptions: JSON.stringify(settings.featureOptions),
    locale: settings.locale,
  });
};

export async function setFeatureSettings(features: FeatureID[]) {
  const settingsConfig = await loadSettings();
  if (!isNull(settingsConfig['featureOptions'])) {
    return;
  }
  let settings = defaultSettings;
  features.map((id) => {
    settings.featureOptions.push({
      id: id,
      isEnabled: true,
    });
  });
  saveSettings(settings);
}

export function getFeatureIsEnabled(settings: any, id: FeatureID | string) {
  const { featureOptions } = settings;
  const prefix = 'hypercrx-';
  let res = false;
  if (featureOptions.length === 0) return true;
  featureOptions.map((opt: FeatureOption) => {
    if (id == `${prefix}${opt.id}`) {
      res = opt.isEnabled;
    }
  });
  return res;
}
