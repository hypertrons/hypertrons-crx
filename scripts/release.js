import { readJson, writeJson, processFile } from './utils.js';

async function bump({ version }) {
  const pkg = await readJson('../package.json');
  pkg.version = version;
  await writeJson('package.json', pkg);

  // Update github issue templates
  processFile('../publish/update_information.json', (content) =>
    content.replace(/(\"latest_version\")\:.*?,/g, `$1: "${version}",`)
  );
  processFile('../src/mock/background.data.ts', (content) =>
    content.replace(/(latest_version)\:.*?,/g, `$1: '${version}',`)
  );
}

async function run() {
  const importDefault = async (module) => (await import(module)).default;
  const minimist = await importDefault('minimist');
  const params = await minimist(process.argv.slice(2), {
    string: ['version'],
    boolean: ['dry'],
    alias: { v: 'version' },
  });
  params.previousVersion = (await readJson('../package.json')).version;
  if (params.previousVersion === params.version) {
    console.error(`error version number cannot be the same.`);
    process.exit(1);
  } else if (params.version === undefined) {
    const pattern = /\d+/g;
    var [major, minor, patch] = params.previousVersion
      .match(pattern)
      .map((x) => parseInt(x));
    params.version = [major, minor, patch + 1].join('.');
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

run();
