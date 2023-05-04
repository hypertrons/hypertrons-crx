// settings.ts
// load and save settings through chromeGet and chromeSet
// all features should load settings first
import { chromeGet, chromeSet, isNull } from './utils';

export interface FeatureOption {
  id: FeatureID;
  isEnabled: boolean;
}

export interface Settings {
  featureOptions: FeatureOption[];
  locale: string;
}

export const defaultSettings: Settings = {
  featureOptions: [],
  locale: 'en',
};

export async function loadSettings() {
  let settingsConfig = JSON.parse(await chromeGet('settings'));
  if (isNull(settingsConfig)) {
    settingsConfig = {};
  }
  return {
    featureOptions: settingsConfig['featureOptions'],
    locale: settingsConfig['locale'],
  };
}

export const saveSettings = async (settings: Settings) => {
  await chromeSet(
    'settings',
    JSON.stringify({
      featureOptions: settings.featureOptions,
      locale: settings.locale,
    })
  );
};

export async function setFeatureSettings(features: FeatureID[]) {
  const settingsConfig = await loadSettings();
  if (!isNull(settingsConfig['featureOptions'])) {
    return; // already set (not first time)
  }
  let settings = defaultSettings;
  features.map((id) => {
    settings.featureOptions.push({
      id: id,
      isEnabled: true,
    });
  });
  await saveSettings(settings);
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
