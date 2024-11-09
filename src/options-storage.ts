import { importedFeatures } from '../README.md';

export type HypercrxOptions = typeof defaults;

export const defaults = Object.assign(
  {
    locale: 'en',
  },
  Object.fromEntries(
    importedFeatures.map((name) => [
      `hypercrx-${name}` as FeatureId,
      name === 'oss-gpt' ? false : true, // Set oss gpt to not be enabled by default
    ])
  )
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
