Language : US | [CN](./README.zh-CN.md)

<h1 align="center">Hypertrons Chrome Extension</h1>

<div align="center">

[![CLA assistant](https://cla-assistant.io/readme/badge/hypertrons/hypertrons-crx)](https://cla-assistant.io/hypertrons/hypertrons-crx)

</div>

`Hypertrons-crx` project aims at tracing, digging and gaining insight into the projects and developers you're interested in. We do this by inserting useful dashboards into `GitHub` pages. `Hypertrons-crx` provides an effective way for digital operations and analysis of open source community.

## Dashboards 🔥🔥🔥

<table>
	<tr>
		<th width="50%">
			<p> Project Correlation Network
			<p><img src="./assets/crx-demo-p1.png">
		<th width="50%">
			<p>Developer Collabration Network within project
			<p><img src="./assets/crx-demo-p2.png" width="100%">
	<tr>
	<tr>
		<th width="50%">
			<p>Developer Collabration Network
			<p><img src="./assets/crx-demo-d1.png">
		<th width="50%">
			<p>Developer's Most Participated Repos
			<p><img src="./assets/crx-demo-d2.png" width="100%">
</table>

### Project Releated 🎉

- **Project Correlation Network**: Project Correlation Network shows the correlation between projects for a given time period. From this graph you can find the projects that are related to the given project.

- **Developer Collabration Network within project**: Developer Collabration Network within project shows the collaboration between active developers within the project for a given time period. From this graph you can find the active developers in the given project. What's more, you can find the collaborative relationships between these developers.

### Developer Releated 🎉

- **Developer Collabration Network**: Developer Collaboration Network shows the collaboration between developers for a given time period. From this graph you can find other developers who are closet to a given developer.
- **Developer's Most Participated Repos**: Developer's Most Participated Repos shows the active projects of developers in a given time period. From this graph you can find out the most active repositories for a given developer.

## Install

[link-chrome]: https://chrome.google.com/webstore/detail/hypertrons/jkgfcnkgfapbckbpgobmgiphpknkiljm 'Version published on Chrome Web Store'

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/jkgfcnkgfapbckbpgobmgiphpknkiljm.svg?label=%20">][link-chrome] also compatible with [<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/edge/edge.svg" width="24" alt="Edge" valign="middle">][link-chrome] [<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/opera/opera.svg" width="24" alt="Opera" valign="middle">][link-chrome]

For more information please refer to [Installation Guide](./INSTALLATION.md).

## Contributing

### Quickstart

```bash
git clone git@github.com:hypertrons/hypertrons-crx.git
cd hypertrons-crx
npm install
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
      "startUrl": ["https://github.com/hypertrons/hypertrons-crx"]
    }
  }
}
```

### Q&A

Any type of contribution is welcome, you can submit [Issue](https://github.com/hypertrons/hypertrons-crx/issues) to report bugs or ask question。

For more information please refer to [Contributing Guide](./CONTRIBUTING.md).
