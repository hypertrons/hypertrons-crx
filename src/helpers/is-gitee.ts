const isGitee = (): boolean => {
  return window.location.href.startsWith('https://gitee.com/');
};

export default isGitee;
