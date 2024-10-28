const baseUrl = 'https://open-digger.cn/docs/'; // Document URL prefix
const repoName = 'X-lab2017/open-digger-website'; // repository name
const branch = 'master'; // repository branch
const platform = 'Github'; // repository platform
export function openDiggerUrlParser(url: string) {
  // Determine if the URL starts with the specified open finger path
  if (url.startsWith(baseUrl)) {
    // Extract the remaining path
    const docPath = url.replace(baseUrl, '').split('#')[0];

    // Splicing together the corresponding file path for repository
    const filePath = `docs/${docPath}.md`;

    return {
      filePath: filePath,
      repoName: repoName,
      branch: branch,
      platform: platform,
    };
  }
  //If there is no match, return null
  return null;
}
