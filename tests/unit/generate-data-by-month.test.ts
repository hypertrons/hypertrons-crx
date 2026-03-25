import { describe, expect, it } from 'vitest';
import generateDataByMonth from '../../src/helpers/generate-data-by-month';

describe('generateDataByMonth', () => {
  it('returns empty array for null input', () => {
    expect(generateDataByMonth(null)).toEqual([]);
  });

  it('fills missing months with zeros and keeps existing values', () => {
    const data = {
      '2023-01': 5,
      '2023-03': 7,
      all: 12,
      '2023-Q1': 12,
    };

    const updatedAt = new Date('2023-04-15').getTime();
    const result = generateDataByMonth(data, updatedAt);

    expect(result).toEqual([
      ['2023-01', 5],
      ['2023-02', 0],
      ['2023-03', 7],
    ]);
  });
});
