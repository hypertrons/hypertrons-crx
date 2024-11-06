const baseUrl = 'https://www.x-lab.info/oss101-bok/textbook/'; //  Document URL prefix
const repoName = 'X-lab2017/oss101-bok'; // repository name
const branch = 'master'; // repository branch
const platform = 'Github'; // repository platform
export function OSS101TextbooksUrlParser(url: string) {
  // Determine if the URL starts with the specified open finger path
  console.log(url.startsWith(baseUrl));
  if (url.startsWith(baseUrl)) {
    // Extract the remaining path
    const docPath = url.replace(baseUrl, '').split('#')[0];

    // Splicing together the corresponding file path for repository
    const filePath = `docs/textbook/${docPath.slice(0, -1)}.md`;

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
