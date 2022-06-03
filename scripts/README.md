# Hypercrx script
`release.js` updates all the version numbers in the project to `NEW_VERSION`.

## Usage

```sh
yarn run release [--deploy] [--version NEW_VERSION]
# Or
node release.js  [--deploy] [--version NEW_VERSION]
```

The format of `NEW_VERSION` should be three numbers joined with dots (xx.xx.xx).
Use flag `--deploy` to update version numbers information of the deployment version; otherwise, those part will be ignored.
If you run without flag `--version`, release.js will automatically increase patch number by 1.
The script has its own `package.json` so we can reinstall the root's `node_modules/` while making the release.

## Credits

This script was inspired by [prettier's release script](https://github.com/prettier/prettier/tree/main/scripts/release).
