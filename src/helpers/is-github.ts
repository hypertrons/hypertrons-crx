const isGithub = (): boolean => {
  return window.location.href.includes('https://github.com/');
};

export default isGithub;
