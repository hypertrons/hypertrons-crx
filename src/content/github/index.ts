
import { HypertronsDashboard } from '../common/hypertrons-dashboard'
import{ getMetaContent } from '../../utils/utils'
import $ from 'jquery'

new HypertronsDashboard({
    getInsertElement: () => $('.container-xl'),
    insertType: 'before',
    welcome: true,
    userName: getMetaContent('user-login'),
    repoName: getMetaContent('octolytics-dimension-repository_nwo'),
    role: 'role',
    getWelcome: (userName: any, repoName: any, role: any) => `Welcome to ${repoName}, ${userName}, ${role} of this repo.`,
  });

