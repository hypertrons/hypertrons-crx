import { chromeGet, chromeSet, isNull } from './utils';

class Settings {
  checkForUpdates: boolean | undefined;
  DeveloperNetwork: boolean | undefined;
  ProjectNetwork: boolean | undefined;

  constructor() {
    this.checkForUpdates = true;
    this.DeveloperNetwork = true;
    this.ProjectNetwork = true;
  }

  loadFromJson(data: { [key: string]: any; }): void {
    if ("checkForUpdates" in data) {
      this.checkForUpdates = data["checkForUpdates"];
    }
    if ("DeveloperNetwork" in data) {
      this.DeveloperNetwork = data["DeveloperNetwork"];
    }
    if ("ProjectNetwork" in data) {
      this.ProjectNetwork = data["ProjectNetwork"];
    }
  }

  toJson(): { [key: string]: any; } {
    const result: { [key: string]: any; } = {};
    result["checkForUpdates"] = this.checkForUpdates;
    result["DeveloperNetwork"] = this.DeveloperNetwork;
    result["ProjectNetwork"] = this.ProjectNetwork;

    return result;
  }
}

export const loadSettings = async () => {
  const settings = new Settings();
  let obj = await chromeGet("settings");
  if (isNull(obj)) {
    obj = {};
  };
  settings.loadFromJson(obj);
  return settings;
}

export const mergeSettings = async (data: { [key: string]: any; }) => {
  const settings = await loadSettings();
  if (!isNull(data)) {
    settings.loadFromJson(data);
    await chromeSet("settings", settings.toJson());
  }
  return settings;
}


export default Settings;