import $ from 'jquery';
import { HypertronsDashboard } from '../common/hypertrons-dashboard';
import { getMetaContent } from '../../../utils/utils';

// eslint-disable-next-line no-new
new HypertronsDashboard({
  getInsertElement: () => $('.container-xl'),
  insertType: 'before',
  welcome: true,
  userName: getMetaContent('user-login'),
  repoName: getMetaContent('octolytics-dimension-repository_nwo'),
  role: 'role',
  getWelcome: (userName: any, repoName: any, role: any) =>
    `Welcome to ${repoName}, ${userName}, ${role} of this repo.`,
});
