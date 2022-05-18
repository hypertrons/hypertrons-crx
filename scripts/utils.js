import { execa } from 'execa';
import fs from 'node:fs';

function runGit(args, options) {
  args = Array.isArray(args) ? args : [args];
  return execa('git', args, options);
}

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
export { runGit, readJson, writeJson, processFile };
