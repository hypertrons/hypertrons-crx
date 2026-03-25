import { describe, expect, it } from 'vitest';
import { isAllNull, isNull } from '../../src/helpers/is-null';

describe('isNull', () => {
  it('returns true for null-like values', () => {
    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(true);
    expect(isNull('')).toBe(true);
    expect(isNull([])).toBe(true);
    expect(isNull({})).toBe(true);
  });

  it('returns false for non-empty values', () => {
    expect(isNull('ok')).toBe(false);
    expect(isNull([1])).toBe(false);
    expect(isNull({ a: 1 })).toBe(false);
    expect(isNull(0)).toBe(false);
  });
});

describe('isAllNull', () => {
  it('returns true when all values are null', () => {
    expect(isAllNull({ a: null, b: null })).toBe(true);
  });

  it('returns false when any value is not null', () => {
    expect(isAllNull({ a: null, b: 1 })).toBe(false);
  });
});
