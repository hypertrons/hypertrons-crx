import { describe, expect, it } from 'vitest';
import exists from '../../src/helpers/exists';

describe('exists', () => {
  it('returns true when selector exists in DOM', () => {
    document.body.innerHTML = '<div class="target"></div>';

    expect(exists('.target')).toBe(true);
  });

  it('returns false when selector does not exist', () => {
    document.body.innerHTML = '<div class="other"></div>';

    expect(exists('.target')).toBe(false);
  });
});
