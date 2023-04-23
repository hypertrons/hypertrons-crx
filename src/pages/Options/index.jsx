// initializeIcons() should only be called once per app and must be called before rendering any components.
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();

import React from 'react';
import { render } from 'react-dom';

import Options from './Options';
import './index.css';
import { importedFeatures } from '../../../scripts/features-loader.js';

render(
  <Options importedFeatures={importedFeatures} />,
  window.document.querySelector('#app-container')
);
console.log('options.index.jsx');

if (module.hot) module.hot.accept();
