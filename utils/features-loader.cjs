const fs = require('fs');

function getImportedFeatures() {
  const contents = fs.readFileSync('src/pages/ContentScripts/index.ts', 'utf8');
  const importedFeatures = [
    ...contents.matchAll(/^import '\.\/features\/([^.]+)';/gm),
  ]
    .map((match) => match[1])
    .sort();
  return importedFeatures;
}

// a webpack loader
function FeaturesLoader(content, map, meta) {
  return `
    export const importedFeatures = ${JSON.stringify(getImportedFeatures())}
  `;
}

module.exports = FeaturesLoader;
