// according to https://github.com/TriPSs/conventional-changelog-action#pre-commit-hook
// this script should be a CommonJS module

const semver =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/i;

function validate({ version }) {
  // validate if the given version conforms semver
  return String(version).match(semver) === null;
}

function compare({ oldVersion, newVersion }) {
  // compare oldVersion and newVersion number
  // return -1 if oldVersion is greater;
  //         0 if two versions are equal;
  //         1 if newVersion is greater
  let [oldMajor, oldMinor, oldPatch] = oldVersion.split('.').map(Number);
  let [newMajor, newMinor, newPatch] = newVersion.split('.').map(Number);
  if (oldMajor !== newMajor) {
    return oldMajor > newMajor ? -1 : 1;
  }
  if (oldMinor !== newMinor) {
    return oldMinor > newMinor ? -1 : 1;
  }
  if (oldPatch !== newPatch) {
    return oldPatch > newPatch ? -1 : 1;
  }
  return 0;
}

async function bump({ version, deploy }) {
  const { readJson, writeJson, processFile } = require('./utils.cjs');
  // update package.json
  const pkgPath = 'package.json';
  const pkg = await readJson(pkgPath);
  if (compare({ oldVersion: pkg.version, newVersion: version }) <= 0) {
    throw new Error(
      'Input version number is not greater than the current version number!'
    );
  }
  pkg.version = version;
  writeJson(pkgPath, pkg);

  // update update_information.json
  const infoPath = 'publish/update_information.json';
  const update_info = await readJson(infoPath);
  // we only update version number in extension store when deploy
  if (deploy) {
    update_info.chrome.latest_version = version;
    update_info.edge.latest_version = version;
  }
  if (
    compare({
      oldVersion: update_info.develop.latest_version,
      newVersion: version,
    }) <= 0
  ) {
    throw new Error(
      'Input version number is not greater than the current version number!'
    );
  }
  update_info.develop.latest_version = version;
  writeJson(infoPath, update_info);
}

module.exports = { bump };

try {
  const [nodePath, scriptPath, versionNumber, ...otherArgs] = process.argv;
  if (versionNumber !== undefined) {
    if (validate({ version: versionNumber })) {
      // version number is not valid
      throw new Error('Input version number is valid');
    }
    bump({ version: versionNumber, deploy: true });
  }
} catch (error) {
  console.error(error);
  return -1;
}
return 0;
