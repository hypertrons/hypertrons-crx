import { importedFeatures } from '../../../README.md';

export type HypercrxOptions = typeof defaults;

const defaults = Object.assign(
  {
    locale: 'en',
  },
  Object.fromEntries(importedFeatures.map((id) => [`feature:${id}`, true]))
);

class OptionsStorage {
  public async getAll(): Promise<HypercrxOptions> {
    return (await chrome.storage.sync.get(defaults)) as HypercrxOptions;
  }

  public async set(options: Partial<HypercrxOptions>): Promise<void> {
    await chrome.storage.sync.set(options);
  }
}

const optionsStorage = new OptionsStorage();

export default optionsStorage;
