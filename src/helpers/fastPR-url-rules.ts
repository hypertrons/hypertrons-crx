import { digitalTextbooksUrlParser } from './digitalTextbooks-url-parser';
import { openDiggerUrlParser } from './openDigger-url-parser';
import { OSS101TextbooksUrlParser } from './OSS101Textbooks-url-parser';

type UrlRule = {
  domains: string[];
  ruleFunction: (url: string) => { filePath: string; repoName: string; branch: string } | null;
};
const urlRules: UrlRule[] = [
  {
    domains: ['open-digger.cn', 'open-digger'],
    ruleFunction: openDiggerUrlParser,
  },
  {
    domains: ['digital-textbooks', 'x-lab.info/digital-textbooks'],
    ruleFunction: digitalTextbooksUrlParser,
  },
  {
    domains: ['x-lab.info/oss101-bok'],
    ruleFunction: OSS101TextbooksUrlParser,
  },
];
export function matchFastPrUrl(url: string) {
  for (const rule of urlRules) {
    const isMatch = rule.domains.some((domain) => url.includes(domain));
    if (isMatch) {
      const result = rule.ruleFunction(url);
      return result;
    }
  }
  return null;
}
