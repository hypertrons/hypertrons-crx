import { describe, expect, it, vi } from 'vitest';

const { isGithubMock } = vi.hoisted(() => ({
  isGithubMock: vi.fn(),
}));

vi.mock('../../src/helpers/is-github', () => ({
  default: isGithubMock,
}));

import getGithubTheme from '../../src/helpers/get-github-theme';

describe('getGithubTheme', () => {
  it('returns undefined when not on github', () => {
    isGithubMock.mockReturnValue(false);
    expect(getGithubTheme()).toBeUndefined();
  });

  it('returns light when color mode is light', () => {
    isGithubMock.mockReturnValue(true);
    document.body.innerHTML = '<div data-color-mode="light" data-light-theme="light" data-dark-theme="dark"></div>';

    expect(getGithubTheme()).toBe('light');
  });

  it('resolves auto mode to dark when prefers dark and dark theme starts with dark', () => {
    isGithubMock.mockReturnValue(true);
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    document.body.innerHTML =
      '<div data-color-mode="auto" data-light-theme="light" data-dark-theme="dark_dimmed"></div>';

    expect(getGithubTheme()).toBe('dark');
  });
});
