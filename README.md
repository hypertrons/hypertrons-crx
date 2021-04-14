# Hypertrons Chrome Extension

[![CLA assistant](https://cla-assistant.io/readme/badge/hypertrons/hypertrons-crx)](https://cla-assistant.io/hypertrons/hypertrons-crx)

This project is Hypertrons Chrome extension which help users to improve their user experience of Hypertrons.

## Functions

The main purpose of this project is to enhance Chrome to show dashboard on web pages of certain hosting service like GitHub, GitLab and Gitee.

Currently we have the following default dashboard components:

- Developer Collaboration Network
  - [x] Developer Collaboration Network for a developer.
  - [x] The 10 most participated projects and their connection network.
- Project Correlation Network
  - [x] Network that shows the 10 most correlated projects.
  - [x] Developer Collaboration Network within the project.
 

## Install

Please refer to [Installation Guide](INSTALLATION.md).

## Quickstart

```bash
git clone git@github.com:hypertrons/hypertrons-crx.git
cd hypertrons-crx
npm install
```

Then you can try `npm run start` and visit `http://127.0.0.1:3000` to see some popup pages and options pages.

```bash
npm run start
```

If you want to run and test the whole extension, try the following commands:

```bash
npm run watch
npm run web-ext
```

[web-ext](https://github.com/mozilla/web-ext) would open `Chrome` and load `Hypertrons-crx` into the browser automatically. And the deault configuration of `web-ext` can be found in [package.json](https://github.com/hypertrons/hypertrons-crx/blob/master/package.json):

```json
{
  "webExt": {
      "sourceDir": "distribution",
      "run": {
        "keepProfileChanges": true,
        "chromiumProfile": "./test/web-ext-profile",
        "startUrl": [
          "https://github.com/"
        ]
      }
    }
  }
```
