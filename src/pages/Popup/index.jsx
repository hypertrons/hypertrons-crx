import React from 'react';
import { render } from 'react-dom';
import CollectionList from '../ContentScripts/features/repo-collection/view';
import Popup from './Popup';

render(<Popup />, window.document.querySelector('#app-container'));
render(<CollectionList />, window.document.querySelector('#CollectionList'));

if (module.hot) module.hot.accept();
