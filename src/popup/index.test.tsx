import React from 'react';
import renderer from 'react-test-renderer';
import Popup from './index';

it('renders correctly', () => {
  const tree = renderer.create(<Popup />).toJSON();
  expect(tree).toMatchSnapshot();
});
