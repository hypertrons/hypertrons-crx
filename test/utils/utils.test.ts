import { elementExists, getMetaContent } from '../../src/utils/utils';
import $ from 'jquery';

describe('Test elementExists', () => {
  test('Element Exists', () => {
    const ele = $('<h1></h1>');
    expect(elementExists(ele)).toBe(true);
  });
  test('Element NOT Exists', () => {
    const ele = null;
    expect(elementExists(ele)).toBe(false);
  });
});

describe('Test getMetaContent', () => {
  test('Meta Content Exists', () => {
    var metaTag = document.createElement('meta');
    metaTag.name = 'user-login';
    metaTag.content = 'Tom';
    document.getElementsByTagName('head')[0].appendChild(metaTag);
    expect(getMetaContent('user-login')).toBe('Tom');
  });
  test('Meta Tag NOT Exists', () => {
    expect(getMetaContent('NOT_EXITS_TAG')).toBe(null);
  });
  test('Meta Content NOT Exists', () => {
    var metaTag = document.createElement('meta');
    metaTag.name = 'user-login-with-empty-content';
    metaTag.content = '';
    document.getElementsByTagName('head')[0].appendChild(metaTag);
    expect(getMetaContent('user-login-with-empty-content')).toBe(null);
  });
});
