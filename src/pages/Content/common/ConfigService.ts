import $ from 'jquery';
import {ComponentConfig} from './DashboardService'

export const loadConfigFromGithub = (): ComponentConfig[] => {
  const config:ComponentConfig={
    name: 'DeveloperCollabrationNetwork',
    enable: true,
    insertElement: () => $('.js-pinned-items-reorder-container').parent(),
    insertType: 'before',
    props: {
      developerLogin: 'testDeveloperLogin'
    }
  }
  return [config];
}