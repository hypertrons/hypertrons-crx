import isGitee from './is-gitee';
import isGithub from './is-github';

export const getPlatform = (): 'github' | 'gitee' | 'unknown' => {
  if (isGithub()) return 'github';
  if (isGitee()) return 'gitee';
  return 'unknown';
};
