const fs = require('fs');

function getImportedFeatures(){
	const contents = fs.readFileSync('src/pages/ContentScripts/index.ts', 'utf8');
	const importedFeatures = [...contents.matchAll(/^import '\.\/features\/([^.]+)';/gm)]
		.map(match => match[1])
		.sort();
  return importedFeatures;
}



module.exports = () => {
    // NOTE: this return value will replace the module in the bundle
    return {
      cacheable: true,
      code: `export const importedFeatures = ${JSON.stringify(getImportedFeatures())}`,
    };
  };
