# Hypercrx script

## Usage

```sh
node release.js --version NEW_VERSION
```

The script has its own `package.json` so we can reinstall the root's `node_modules/` while making the release.

## Credits

This script was inspired by [prettier's release script](https://github.com/prettier/prettier/tree/main/scripts/release).
