import { describe, expect, it } from 'vitest';
import { formatNum, numberWithCommas } from '../../src/helpers/formatter';

describe('formatNum', () => {
  it('formats small numbers without suffix', () => {
    expect(formatNum(999, 0)).toBe('999');
  });

  it('formats thousands with k suffix', () => {
    expect(formatNum(1500, 0)).toBe('1.5k');
  });

  it('preserves negative sign', () => {
    expect(formatNum(-1500, 0)).toBe('-1.5k');
  });
});

describe('numberWithCommas', () => {
  it('adds commas to large integers', () => {
    expect(numberWithCommas(1234567)).toBe('1,234,567');
  });
});
