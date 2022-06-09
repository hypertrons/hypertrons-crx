const { bump } = require('./release.js');

exports.preCommit = ({ version }) => {
  bump({ version: version, deploy: false });
};
