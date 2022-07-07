// according to https://github.com/TriPSs/conventional-changelog-action#pre-commit-hook
// this script should be a CommonJS module

const { bump } = require('./bump-version.cjs');

exports.preCommit = ({ version }) => {
  bump({ version: version, deploy: true });
};
