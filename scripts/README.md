# Hypercrx script

## Usage

```sh
yarn run release [--version NEW_VERSION]
# Or
node release.js [--version NEW_VERSION]
```

The format of `NEW_VERSION` should be three numbers joined with dots (xx.xx.xx).
If you run without flag `--version`, release.js will automatically increase patch number by 1.
The script has its own `package.json` so we can reinstall the root's `node_modules/` while making the release.

## Credits

This script was inspired by [prettier's release script](https://github.com/prettier/prettier/tree/main/scripts/release).
