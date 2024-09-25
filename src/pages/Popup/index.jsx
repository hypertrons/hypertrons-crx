import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
createRoot(window.document.querySelector('#app-container')).render(<Popup />);

if (module.hot) module.hot.accept();
