document.addEventListener('turbo:before-visit', () => {
  [...document.getElementsByTagName('style')].forEach((element, index) => {
    if (element.hasAttribute('data-merge-styles')) {
      element.setAttribute('data-id', index + '');
    }
  });
});
