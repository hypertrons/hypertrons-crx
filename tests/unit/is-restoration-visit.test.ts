import { describe, expect, it } from 'vitest';
import isRestorationVisit from '../../src/helpers/is-restoration-visit';

describe('isRestorationVisit', () => {
  it('returns false by default before any turbo:visit event', () => {
    expect(isRestorationVisit()).toBe(false);
  });

  it('returns true after restore turbo:visit event', () => {
    document.dispatchEvent(
      new CustomEvent('turbo:visit', {
        detail: { action: 'restore' },
      })
    );

    expect(isRestorationVisit()).toBe(true);
  });

  it('returns false after advance turbo:visit event', () => {
    document.dispatchEvent(
      new CustomEvent('turbo:visit', {
        detail: { action: 'advance' },
      })
    );

    expect(isRestorationVisit()).toBe(false);
  });
});
