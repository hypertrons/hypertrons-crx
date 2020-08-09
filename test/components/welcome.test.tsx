import React from 'react';
import renderer from 'react-test-renderer';
import Welcome from '../../src/content/components/Welcome/index';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <Welcome
        userName="heming6666"
        repoName="hypertrons/hypertrons-crx"
        // eslint-disable-next-line jsx-a11y/aria-role
        role="commiter"
        welcomeMsg={(userName: any, repoName: any, role: any) =>
          `Welcome to ${repoName}, ${userName}, ${role} of this repo.`
        }
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
