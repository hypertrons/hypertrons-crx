const isPerceptor = (): boolean => {
  return window.location.search.includes('?redirect=perceptor');
};

export default isPerceptor;
