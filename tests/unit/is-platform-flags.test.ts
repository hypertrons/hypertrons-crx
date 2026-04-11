import { describe, expect, it } from 'vitest';
import isGithub from '../../src/helpers/is-github';
import isGitee from '../../src/helpers/is-gitee';
import isPerceptor from '../../src/helpers/is-perceptor';

const setLocation = (href: string) => {
  const url = new URL(href);
  Object.defineProperty(window, 'location', {
    value: {
      href: url.href,
      search: url.search,
    },
    configurable: true,
  });
};

describe('platform flag helpers', () => {
  it('detects github url', () => {
    setLocation('https://github.com/hypertrons/hypertrons-crx');
    expect(isGithub()).toBe(true);
    expect(isGitee()).toBe(false);
  });

  it('detects gitee url', () => {
    setLocation('https://gitee.com/hypertrons/hypertrons-crx');
    expect(isGitee()).toBe(true);
    expect(isGithub()).toBe(false);
  });

  it('detects perceptor redirect query', () => {
    setLocation('https://github.com/hypertrons/hypertrons-crx?redirect=perceptor');
    expect(isPerceptor()).toBe(true);
  });
});
