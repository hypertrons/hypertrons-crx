import $ from 'jquery';

export const loadConfigFromGithub = async (): Promise<any> => {
  const config = [{
    name: 'DeveloperCollabrationNetwork',
    enable: true,
    insertElement: () => $('.js-pinned-items-reorder-container').parent(),
    insertType: 'before',
    props: {
      developerLogin: 'testDeveloperLogin'
    }
  }];
  return config;
}