import { exec } from 'node:child_process';
import { readJson, writeJson, processFile } from './utils.js';

async function bump({ version }) {
  const pkg = await readJson('package.json');
  pkg.version = version;
  await writeJson('package.json', pkg);

  // Update github issue templates
  processFile('publish/update_information.json', (content) =>
    content.replace(/(\"latest_version\")\:.*?,/g, `$1: "${version}",`)
  );
  processFile('src/mock/background.data.ts', (content) =>
    content.replace(/(latest_version)\:.*?,/g, `$1: '${version}',`)
  );
}

async function run() {
  const { runGit } = await import('./utils.js');
  const importDefault = async (module) => (await import(module)).default;
  const minimist = await importDefault('minimist');
  const semver = await importDefault('semver');
  const params = minimist(process.argv.slice(2), {
    string: ['version'],
    boolean: ['dry'],
    alias: { v: 'version' },
  });
  const { stdout: previousVersion } = await runGit([
    'describe',
    '--tags',
    '--abbrev=0',
  ]);
  if (semver.parse(previousVersion) === null) {
    throw new Error(`Unexpected previousVersion: ${previousVersion}`);
  } else {
    params.previousVersion = previousVersion;
    params.previousVersionOnDefaultBranch = (
      await readJson('package.json')
    ).version;
  }
  const steps = await Promise.all([bump]);

  try {
    for (const step of steps) {
      await step(params);
    }
  } catch (error) {
    const message = error.message.trim();
    const stack = error.stack.replace(message, '');
    console.error(`${'error'} ${message}\n${stack}`);
    process.exit(1);
  }
}

exec(
  [
    'git fetch --tags', // Fetch git tags to get the previous version number (i.e. the latest tag)
    'git tag -d latest', // Delete the "latest" tag
  ].join(' && '),
  (error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    } else {
      run();
    }
  }
);
