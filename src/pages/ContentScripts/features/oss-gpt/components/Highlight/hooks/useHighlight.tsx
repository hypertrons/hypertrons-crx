import hljs from 'highlight.js/lib/core';
import { default as bash, default as sh } from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import { default as javascript, default as jsx } from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import { default as tsx, default as typescript } from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import php from 'highlight.js/lib/languages/php';
import { useEffect } from 'react';

// List of currently supported languages
export const languageMap = {
  javascript,
  typescript,
  css,
  json,
  markdown,
  xml,
  yaml,
  tsx,
  jsx,
  java,
  python,
  sql,
  bash,
  sh,
  cpp,
  php,
  c,
};
export type LanguageKeys = keyof typeof languageMap;
export const useHighlight = (language?: LanguageKeys) => {
  // Load languages on demand
  useEffect(() => {
    if (language && languageMap[language]) {
      hljs.registerLanguage(language, languageMap[language]);
    } else {
      Object.keys(languageMap).forEach((lan) => {
        hljs.registerLanguage(lan, languageMap[lan as LanguageKeys]);
      });
    }
  }, [language]);

  const renderHighlight = (content: string) => {
    let result = '';
    if (language && languageMap[language]) {
      result = hljs.highlight(content || '', { language: language, ignoreIllegals: true }).value;
    } else {
      result = hljs.highlightAuto(content).value;
    }
    return result;
  };
  return { renderHighlight };
};
