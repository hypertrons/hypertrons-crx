import React from 'react';
import { render } from 'react-dom';
import PopupPage from '../../components/PopupPage/index'

import './index.css';

render(<PopupPage />, window.document.querySelector('#app-container'));
