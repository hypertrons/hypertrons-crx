// remote-code.js
export const urlRules = [
  {
    domains: ['open-digger.cn', 'open-digger'],
    expired: () => new Date().getTime() >= new Date('2024-12-01 00:00:00').getTime(),
    ruleFunction: (url) => {
      const baseUrl = 'https://open-digger.cn/';
      const repoName = 'X-lab2017/open-digger-website';
      const branch = 'master';
      const platform = 'Github';
      let filePath = '';
      if (!url.startsWith(baseUrl)) return null;
      let i18n = null;
      let docPath = url.replace(baseUrl, '').split('#')[0];
      for (const l of ['en/', 'fr/']) {
        if (docPath.startsWith(l)) {
          i18n = l;
          docPath = docPath.substring(l.length);
          break;
        }
      }
      if (docPath.startsWith('docs/')) {
        docPath = docPath.substring('docs/'.length);
        filePath = `${i18n != null ? `i18n/${i18n}docusaurus-plugin-content-docs/current/` : 'docs/'}${docPath}.md`;
      } else if (docPath.startsWith('blog/')) {
        filePath = `${i18n != null ? `i18n/${i18n}docusaurus-plugin-content-` : ''}${docPath}/index.mdx`;
      }
      return { filePath, repoName, branch, platform };
    },
    tests: [
      [
        // docs
        'https://open-digger.cn/docs/user_docs/label_data',
        'docs/user_docs/label_data.md',
      ],
      [
        // docs in sub directory
        'https://open-digger.cn/docs/user_docs/metrics/change_requests',
        'docs/user_docs/metrics/change_requests.md',
      ],
      [
        // blog
        'https://open-digger.cn/blog/2024-08-26-ospp-2023-analysis',
        'blog/2024-08-26-ospp-2023-analysis/index.mdx',
      ],
      [
        // english docs
        'https://open-digger.cn/en/docs/user_docs/label_data',
        'i18n/en/docusaurus-plugin-content-docs/current/user_docs/label_data.md',
      ],
      [
        // english blog
        'https://open-digger.cn/en/blog/2024-04-04-redis-analysis',
        'i18n/en/docusaurus-plugin-content-blog/2024-04-04-redis-analysis/index.mdx',
      ],
    ],
  },
  {
    domains: ['x-lab.info/oss101-bok'],
    ruleFunction: (url) => {
      const baseUrl = 'https://www.x-lab.info/oss101-bok/textbook/';
      const repoName = 'X-lab2017/oss101-bok';
      const branch = 'master';
      const platform = 'Github';
      if (!url.startsWith(baseUrl)) return null;
      const docPath = url.replace(baseUrl, '').split('#')[0];
      const filePath = `docs/textbook/${docPath.slice(0, -1)}.md`;
      return { filePath, repoName, branch, platform };
    },
  },
  {
    domains: ['digital-textbooks/textbooks'],
    ruleFunction: (url) => {
      const baseUrl = 'https://www.x-lab.info/digital-textbooks/textbooks/';
      const repoName = 'wangyantong2000/docwebsite';
      const branch = 'main';
      const platform = 'Gitee';
      if (!url.startsWith(baseUrl)) return null;
      const docPath = url.replace(baseUrl, '').split('#')[0];
      const filePath = `docs/textbooks/${docPath}index.md`;
      return { filePath, repoName, branch, platform };
    },
  },
  {
    domains: ['https://kaiyuanshe.github.io/oss-book'],
    ruleFunction: (url) => {
      const baseUrl = 'https://kaiyuanshe.github.io/oss-book/';
      const repoName = 'kaiyuanshe/oss-book';
      const branch = 'main';
      const platform = 'Github';
      if (!url.startsWith(baseUrl)) return null;
      let docPath = url.replace(baseUrl, '').split('#')[0];
      if (docPath.startsWith('slide')) return null;
      docPath = docPath.replace('.html', '');
      const filePath = `src/${docPath}.md`;
      return { filePath, repoName, branch, platform };
    },
    tests: [
      ['https://kaiyuanshe.github.io/oss-book/Enterprise-and-Open-Source.html', 'src/Enterprise-and-Open-Source.md'],
      ['https://kaiyuanshe.github.io/oss-book/slide/Enterprise-and-Open-Source.html', undefined],
      [
        'https://kaiyuanshe.github.io/oss-book/Software-Lifecycle-Management.html',
        'src/Software-Lifecycle-Management.md',
      ],
    ],
  },
];

function matchFastPrUrl(url) {
  for (const rule of urlRules) {
    const isMatch = rule.domains.some((domain) => url.includes(domain));
    if (!isMatch) continue;
    if (rule.expired && rule.expired()) return null;
    return rule.ruleFunction(url);
  }
  return null;
}

// Make the function globally available if needed
if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
  window.matchFastPrUrl = matchFastPrUrl;
}
