async function bump({ version, deploy }) {
  const { readJson, writeJson, processFile } = require('./utils.js');
  // update package.json
  const pkgPath = 'package.json';
  const pkg = await readJson(pkgPath);
  pkg.version = version;
  await writeJson(pkgPath, pkg);

  // update update_information.json
  const infoPath = 'publish/update_information.json';
  const update_info = await readJson(infoPath);
  // we only update version number in extension store when deploy
  if (deploy) {
    update_info.chrome.latest_version = version;
    update_info.edge.latest_version = version;
  }
  update_info.develop.latest_version = version;
  writeJson(infoPath, update_info);

  // update background.data.ts
  processFile('src/mock/background.data.ts', (content) =>
    content.replace(/(latest_version)\:.*?,/g, `$1: '${version}',`)
  );
}

module.exports = { bump };
