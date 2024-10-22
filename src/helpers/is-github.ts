const isGithub = (): boolean => {
  return window.location.href.startsWith('https://github.com/');
};

export default isGithub;
