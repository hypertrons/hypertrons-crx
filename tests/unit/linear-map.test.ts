import { describe, expect, it } from 'vitest';
import linearMap from '../../src/helpers/linear-map';

describe('linearMap', () => {
  it('maps a midpoint value in ascending domain', () => {
    expect(linearMap(5, [0, 10], [0, 100])).toBe(50);
  });

  it('clamps to range boundaries in ascending domain', () => {
    expect(linearMap(-1, [0, 10], [0, 100])).toBe(0);
    expect(linearMap(20, [0, 10], [0, 100])).toBe(100);
  });

  it('handles descending domain', () => {
    expect(linearMap(5, [10, 0], [0, 100])).toBe(50);
    expect(linearMap(11, [10, 0], [0, 100])).toBe(0);
    expect(linearMap(-1, [10, 0], [0, 100])).toBe(100);
  });

  it('handles zero-length domain', () => {
    expect(linearMap(10, [1, 1], [3, 7])).toBe(5);
    expect(linearMap(10, [1, 1], [3, 3])).toBe(3);
  });
});
