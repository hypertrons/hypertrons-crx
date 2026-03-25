import shouldFeatureRun from '../../src/helpers/should-feature-run';

describe('shouldFeatureRun', () => {
  it('returns true when defaults are used', async () => {
    await expect(
      shouldFeatureRun({
        asLongAs: undefined,
        include: undefined,
        exclude: undefined,
      })
    ).resolves.toBe(true);
  });

  it('returns false when include conditions are all false', async () => {
    await expect(
      shouldFeatureRun({
        asLongAs: [() => true],
        include: [() => false, async () => false],
        exclude: [() => false],
      })
    ).resolves.toBe(false);
  });

  it('returns false when any exclude condition is true', async () => {
    await expect(
      shouldFeatureRun({
        asLongAs: [() => true],
        include: [() => true],
        exclude: [() => false, async () => true],
      })
    ).resolves.toBe(false);
  });
});
