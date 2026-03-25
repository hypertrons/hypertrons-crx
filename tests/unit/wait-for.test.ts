import { describe, expect, it, vi } from 'vitest';

const { delayMock } = vi.hoisted(() => ({
  delayMock: vi.fn(() => Promise.resolve()),
}));

vi.mock('delay', () => ({
  default: delayMock,
}));

import waitFor from '../../src/helpers/wait-for';

describe('waitFor', () => {
  it('resolves immediately when condition is truthy', async () => {
    const condition = vi.fn(() => true);

    await expect(waitFor(condition)).resolves.toBeUndefined();
    expect(condition).toHaveBeenCalledTimes(1);
    expect(delayMock).not.toHaveBeenCalled();
  });

  it('polls until condition becomes truthy', async () => {
    let call = 0;
    const condition = vi.fn(() => {
      call += 1;
      return call >= 3;
    });

    await expect(waitFor(condition)).resolves.toBeUndefined();
    expect(condition).toHaveBeenCalledTimes(3);
    expect(delayMock).toHaveBeenCalledTimes(2);
    expect(delayMock).toHaveBeenNthCalledWith(1, 10);
  });
});
