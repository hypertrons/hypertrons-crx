const baseOpenDiggerUrl = 'https://open-digger.cn/docs/'; // open-digger Document URL prefix
const repoName = 'X-lab2017/open-digger-website'; // repository name
const branch = 'master'; // repository branch
export function openDiggerUrlParser(url: string) {
  // Determine if the URL starts with the specified open finger path
  if (url.startsWith(baseOpenDiggerUrl)) {
    // Extract the remaining path
    const docPath = url.replace(baseOpenDiggerUrl, '');

    // Splicing together the corresponding file path for repository
    const filePath = `docs/${docPath}.md`;

    return {
      filePath: filePath,
      repoName: repoName,
      branch: branch,
    };
  }
  //If there is no match, return null
  return null;
}
