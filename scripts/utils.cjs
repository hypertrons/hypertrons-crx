// according to https://github.com/TriPSs/conventional-changelog-action#pre-commit-hook
// this script should be a CommonJS module

const fs = require('fs');

function readJson(filename) {
  return JSON.parse(fs.readFileSync(filename));
}

function writeJson(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content, null, 2) + '\n');
}

function processFile(filename, fn) {
  const content = fs.readFileSync(filename, 'utf8');
  fs.writeFileSync(filename, fn(content));
}
module.exports = { readJson, writeJson, processFile };
