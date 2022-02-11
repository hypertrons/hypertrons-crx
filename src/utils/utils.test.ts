import $ from 'jquery';
import { elementExists, getMetaContent, isNull } from './utils';

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
    const metaTag = document.createElement('meta');
    metaTag.name = 'user-login';
    metaTag.content = 'Tom';
    document.getElementsByTagName('head')[0].appendChild(metaTag);
    expect(getMetaContent('user-login')).toBe('Tom');
  });
  test('Meta Tag NOT Exists', () => {
    expect(getMetaContent('NOT_EXITS_TAG')).toBe(null);
  });
  test('Meta Content NOT Exists', () => {
    const metaTag = document.createElement('meta');
    metaTag.name = 'user-login-with-empty-content';
    metaTag.content = '';
    document.getElementsByTagName('head')[0].appendChild(metaTag);
    expect(getMetaContent('user-login-with-empty-content')).toBe(null);
  });
});

describe('Test isNull', () => {
  test('If the object is null', () => {
    const obj = null;
    expect(isNull(obj)).toBe(true);
  });
  test('If the object is undefined', () => {
    const obj = undefined;
    expect(isNull(obj)).toBe(true);
  });
  test('If the object is empty string', () => {
    const obj = '';
    expect(isNull(obj)).toBe(true);
  });
  test('If the object is empty array', () => {
    const obj: never[] = [];
    expect(isNull(obj)).toBe(true);
  });
  test('If the object is NOT null', () => {
    const obj = ['hello world'];
    expect(isNull(obj)).toBe(false);
  });
});
