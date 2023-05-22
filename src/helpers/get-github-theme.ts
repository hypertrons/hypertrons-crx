import $ from 'jquery';

export default function getGithubTheme() {
  // following 3 variables are extracted from GitHub page's html tag properties
  // colorMode has 3 values: "auto", "light" and "dark"
  // lightTheme and darkTheme means "theme in day time" and "theme in night time" respectively
  const colorMode = $('[data-color-mode]')[0].dataset['colorMode'];
  const lightTheme = $('[data-light-theme]')[0].dataset['lightTheme'];
  const darkTheme = $('[data-dark-theme]')[0].dataset['darkTheme'];

  let githubTheme = colorMode;

  if (colorMode === 'auto') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      if (darkTheme?.startsWith('dark')) {
        githubTheme = 'dark';
      } else {
        githubTheme = 'light';
      }
    } else {
      if (lightTheme?.startsWith('dark')) {
        githubTheme = 'dark';
      } else {
        githubTheme = 'light';
      }
    }
  }

  return githubTheme;
}
