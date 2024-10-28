const baseUrl = 'https://www.x-lab.info/digital-textbooks/textbooks/'; //  Document URL prefix
const repoName = 'X-lab2017/digital-textbooks'; // repository name
const branch = 'main'; // repository branch
const platform = 'Github'; // repository platform
export function digitalTextbooksUrlParser(url: string) {
  // Determine if the URL starts with the specified open finger path
  if (url.startsWith(baseUrl)) {
    // Extract the remaining path
    const docPath = url.replace(baseUrl, '').split('#')[0];

    // Splicing together the corresponding file path for repository
    const filePath = `docs/textbooks/${docPath}index.md`;

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
