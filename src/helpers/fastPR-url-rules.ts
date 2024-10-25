import { openDiggerUrlParser } from './openDigger-url-parser';

type UrlRule = {
  domains: string[];
  ruleFunction: (url: string) => { filePath: string; repoName: string; branch: string } | null;
};
const urlRules: UrlRule[] = [
  {
    domains: ['open-digger.cn', 'open-digger'],
    ruleFunction: openDiggerUrlParser,
  },
  // {
  //     domains: ['digital-textbooks', 'X-lab2017/digital-textbooks'],
  //     ruleFunction: (url: string) => {
  //         return {
  //             filePath: 'https://github.com/xlab/open-digger',
  //           repoName: 'open-digger',
  //           branch: 'main'
  //         };

  //     }
  //   },
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
