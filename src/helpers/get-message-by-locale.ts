import messages_en from '../locales/en/messages.json';
import messages_zh_CN from '../locales/zh_CN/messages.json';

const messages_locale = {
  en: messages_en,
  zh_CN: messages_zh_CN,
};

export default function getMessageByLocale(key: string, locale: string) {
  // @ts-ignore
  return messages_locale[locale][key]['message'];
}
