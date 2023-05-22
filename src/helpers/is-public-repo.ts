import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import elementReady from 'element-ready';

// check if the repository is public
export default async function isPublicRepo() {
  // another selector that also works
  // const repoLabel = $('strong[itemprop="name"]').siblings('span.Label.Label--secondary').text();
  await elementReady('#repository-container-header');
  const repoLabel = $('#repository-container-header')
    .find('span.Label.Label--secondary:first')
    .text();
  return (
    pageDetect.isRepo() &&
    (repoLabel === 'Public' || repoLabel === 'Public template')
  );
}
