const { bump } = require('./bump-version.js');

exports.preCommit = ({ version }) => {
  bump({ version: version, deploy: true });
};
