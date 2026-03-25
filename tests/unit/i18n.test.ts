import { describe, expect, it } from 'vitest';
import i18n from '../../src/helpers/i18n';

describe('i18n helper', () => {
  it('is initialized with en and zh_CN resources', () => {
    expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
    expect(i18n.hasResourceBundle('zh_CN', 'translation')).toBe(true);
  });

  it('has fallback language configured', () => {
    expect(i18n.options.fallbackLng).toBeDefined();
  });

  it('returns a string from t()', () => {
    expect(typeof i18n.t('non_existing_key')).toBe('string');
  });
});
