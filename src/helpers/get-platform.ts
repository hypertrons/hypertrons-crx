import isGitee from './is-gitee';
import isGithub from './is-github';

export const getPlatform = (): 'github' | 'gitee' => {
  if (isGithub()) return 'github';
  if (isGitee()) return 'gitee';
  throw new Error('Unsupported platform');
};
