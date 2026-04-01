import { describe, expect, it, vi } from 'vitest';
import { getInterval, judgeInterval } from '../../src/helpers/judge-interval';

describe('getInterval', () => {
  it('returns yearly minInterval when year span is greater than 2', () => {
    const data = [
      ['2020-01', 1],
      ['2023-12', 2],
    ];

    const result = getInterval(data);

    expect(result.timeLength).toBe(3);
    expect(result.minInterval).toBe(365 * 24 * 3600 * 1000);
  });

  it('returns monthly minInterval when year span is 2 or less', () => {
    const data = [
      ['2022-01', 1],
      ['2023-12', 2],
    ];

    const result = getInterval(data);

    expect(result.timeLength).toBe(1);
    expect(result.minInterval).toBe(30 * 3600 * 24 * 1000);
  });
});

describe('judgeInterval', () => {
  it('registers zoom handler and updates xAxis minInterval', () => {
    const option = { xAxis: [{}] as { minInterval?: any }[] };
    let zoomHandler: ((params: any) => void) | undefined;

    const instance = {
      on: vi.fn((event: string, cb: (params: any) => void) => {
        if (event === 'dataZoom') {
          zoomHandler = cb;
        }
      }),
      getOption: vi.fn(() => option),
      setOption: vi.fn(),
    };

    judgeInterval(instance, option, 3);

    expect(instance.on).toHaveBeenCalledWith('dataZoom', expect.any(Function));

    zoomHandler?.({
      batch: [{ start: 0, end: 100 }],
    });

    expect(option.xAxis[0].minInterval).toBe(365 * 24 * 3600 * 1000);
    expect(instance.setOption).toHaveBeenCalledWith(option);
  });

  it('does not register zoom handler for short ranges', () => {
    const instance = {
      on: vi.fn(),
      getOption: vi.fn(),
      setOption: vi.fn(),
    };

    judgeInterval(instance, { xAxis: [{}] }, 2);

    expect(instance.on).not.toHaveBeenCalled();
  });
});
