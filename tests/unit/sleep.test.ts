import { describe, expect, it, vi } from 'vitest';
import sleep from '../../src/helpers/sleep';

describe('sleep', () => {
  it('resolves after the given milliseconds', async () => {
    vi.useFakeTimers();

    const spy = vi.fn();
    const promise = sleep(50).then(spy);

    expect(spy).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(49);
    expect(spy).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await promise;
    expect(spy).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
