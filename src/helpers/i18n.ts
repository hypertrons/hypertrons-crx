import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import messages_en from '../locales/en/translation.json';
import messages_zh_CN from '../locales/zh_CN/translation.json';

const language_resources = {
  zh_CN: {
    translation: messages_zh_CN,
  },
  en: {
    translation: messages_en,
  },
};

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(Backend)
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      skipOnVariables: false,
    },
    resources: language_resources,
  });

export default i18n;
