import React from 'react';
import { render } from 'react-dom';
import { elementExists } from '../../../utils/utils';
import DeveloperCollabrationNetwork from '../components/DeveloperCollabrationNetwork';

type ElementFunction = () => JQuery<HTMLElement>;
type InsertType = 'before' | 'after';

interface ComponentConfig {
  name: string,
  enable: boolean,
  insertElement?: ElementFunction,
  insertType?: InsertType,
  props?: any
}

export const renderDashboard = (componentsConf: ComponentConfig[]) => {
  for (const componentConf of componentsConf) {
    const {
      name,
      enable,
      insertElement,
      insertType = 'before',
      props,
    } = componentConf;

    if (!enable) {
      console.log('Skipping ', name);
      continue;
    }

    if (!insertElement) {
      console.log('Error! insertElement should not be null!')
      continue;
    }

    const ele = insertElement();
    if (!elementExists(ele)) {
      console.log('Error! Element not exist!')
      continue;
    }
    const insertItem = document.createElement('div');
    insertItem.id = name;

    switch (name) {
      case 'DeveloperCollabrationNetwork':
        render(
          <DeveloperCollabrationNetwork props={props} />,
          insertItem,
        );
        break;
      default:
        break;
    }
 
    switch (insertType) {
      case 'before':
        ele.before(insertItem);
        break;
      case 'after':
        ele.after(insertItem);
        break;
      default:
        break;
    }
  }
}
