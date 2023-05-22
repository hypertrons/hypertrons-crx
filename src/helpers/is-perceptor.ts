const isPerceptor = (): boolean =>
  window.location.search.includes('?redirect=perceptor');

export default isPerceptor;
