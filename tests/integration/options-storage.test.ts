import { describe, expect, it, vi } from 'vitest';

vi.mock('../../README.md', () => ({
  importedFeatures: ['repo-networks', 'oss-gpt'],
}));

describe('optionsStorage', () => {
  it('returns defaults including feature toggles from importedFeatures', async () => {
    const { defaults, default: optionsStorage } = await import('../../src/options-storage');

    const all = await optionsStorage.getAll();

    expect(defaults.locale).toBe('en');
    expect(all['hypercrx-repo-networks']).toBe(true);
    expect(all['hypercrx-oss-gpt']).toBe(false);
  });

  it('persists partial updates via set()', async () => {
    const { default: optionsStorage } = await import('../../src/options-storage');

    await optionsStorage.set({ 'hypercrx-repo-networks': false });
    const all = await optionsStorage.getAll();

    expect(all['hypercrx-repo-networks']).toBe(false);
  });
});
