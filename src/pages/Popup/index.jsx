// initializeIcons() should only be called once per app and must be called before rendering any components.
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();

import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
