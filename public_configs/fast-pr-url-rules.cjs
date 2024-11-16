const urlRules = [
  {
    domains: ['open-digger.cn', 'open-digger'],
    ruleFunction: (url) => {
      const baseUrl = 'https://open-digger.cn/';
      if (!url.startsWith(baseUrl)) return null;
      const repoName = 'X-lab2017/open-digger-website';
      const branch = 'master';
      const platform = 'Github';
      const horizontalRatio=0.95;
      const verticalRatio=0.5;
      const urlObj = new URL(url);
      let docPath = urlObj.pathname.slice(1);
      let filePath = '';
      let i18n = null;
      for (const l of ['en/', 'fr/']) {
        if (docPath.startsWith(l)) {
          i18n = l;
          docPath = docPath.substring(l.length);
          break;
        }
      }
      if (docPath.startsWith('docs/')) {
        docPath = docPath.substring('docs/'.length);
         if (docPath.endsWith('metrics/playground')) {
          // playground can not be edited
          return null;
        }
        filePath = `${i18n != null ? `i18n/${i18n}docusaurus-plugin-content-docs/current/` : 'docs/'}${docPath}.md`;
      } else if (docPath.startsWith('blog/')) {
        filePath = `${i18n != null ? `i18n/${i18n}docusaurus-plugin-content-` : ''}${docPath}/index.mdx`;
      } else {
        // not blog and docs
        return null;
      }
      return { filePath, repoName, branch, platform, horizontalRatio, verticalRatio };
    },
    tests: [
      [
        // front page
        'https://open-digger.cn/',
        undefined,
      ],
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
      const horizontalRatio=0.95;
      const verticalRatio=0.5;
      if (!url.startsWith(baseUrl)) return null;
      const docPath = url.replace(baseUrl, '').split('#')[0];
      const filePath = `docs/textbook/${docPath.slice(0, -1)}.md`;
      return { filePath, repoName, branch, platform, horizontalRatio, verticalRatio };
    },
  },
  {
    domains: ['digital-textbooks/textbooks'],
    ruleFunction: (url) => {
      const baseUrl = 'https://www.x-lab.info/digital-textbooks/textbooks/';
      const repoName = 'wangyantong2000/docwebsite';
      const branch = 'main';
      const platform = 'Gitee';
      const horizontalRatio=0.95;
      const verticalRatio=0.5;
      if (!url.startsWith(baseUrl)) return null;
      const docPath = url.replace(baseUrl, '').split('#')[0];
      const filePath = `docs/textbooks/${docPath}index.md`;
      return { filePath, repoName, branch, platform, horizontalRatio, verticalRatio };
    },
  },
  {
    domains: ['https://kaiyuanshe.github.io/oss-book'],
    ruleFunction: (url) => {
      const baseUrl = 'https://kaiyuanshe.github.io/oss-book/';
      const repoName = 'kaiyuanshe/oss-book';
      const branch = 'main';
      const platform = 'Github';
      const horizontalRatio=0.95;
      const verticalRatio=0.95;
      if (!url.startsWith(baseUrl)) return null;
      let docPath = url.replace(baseUrl, '').split('#')[0];
      if (docPath.startsWith('slide')) return null;
      docPath = docPath.replace('.html', '');
      const filePath = `src/${docPath}.md`;
      return { filePath, repoName, branch, platform, horizontalRatio, verticalRatio };
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
  {
    domains: ['https://www.kaiwudb.com/'],
    expired: () => new Date().getTime() > new Date('2025-01-01 00:00:00').getTime(),
    ruleFunction: (url) => {
      const baseUrl = 'https://www.kaiwudb.com/kaiwudb_docs/#/';
      if (!url.startsWith(baseUrl)) return null;
      const repoName = 'kwdb/docs';
      let branch = 'master';
      const platform = 'Gitee';
      const horizontalRatio=0.95;
      const verticalRatio=0.95;
      let docPath = url.replace(baseUrl, '').split('#')[0].replace('.html', '');
      function extractVersion(str) {
        const pattern = /^oss_v(\d+(\.\d+)*)\/.*$/;
        const match = str.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
        return null;
      }
      if (docPath.startsWith('oss_dev/')) {
        // master branch
        docPath = docPath.substring('oss_dev/'.length);
      } else {
        // version branch
        const version = extractVersion(docPath);
        if (version !== null) {
          branch = version;
          docPath = docPath.slice(version.length + 6);
        } else {
          return null;
        }
      }
      const filePath = `${docPath}.md`;
      return { filePath, repoName, branch, platform, horizontalRatio, verticalRatio };
    },
    tests: [
      [
        'https://www.kaiwudb.com/kaiwudb_docs/#/oss_v2.0/sql-reference/data-type/data-type-ts-db.html',
        'sql-reference/data-type/data-type-ts-db.md',
      ],
      [
        'https://www.kaiwudb.com/kaiwudb_docs/#/oss_v2.0.4/deployment/bare-metal/bare-metal-deployment.html',
        'deployment/bare-metal/bare-metal-deployment.md',
      ],
      [
        'https://www.kaiwudb.com/kaiwudb_docs/#/oss_dev/db-operation/error-code/error-code-postgresql.html',
        'db-operation/error-code/error-code-postgresql.md',
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
} else {
  module.exports = { urlRules };
}
