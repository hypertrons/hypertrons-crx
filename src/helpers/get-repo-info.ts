import * as pageDetect from 'github-url-detection';

export function getRepoName() {
  return pageDetect.utils.getRepositoryInfo(window.location)!.nameWithOwner;
}
