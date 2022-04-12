Language : US | [zh-CN](./README.zh-CN.md)

<h1 align="center">Hypercrx</h1>

<div align="center">

[![CLA assistant](https://cla-assistant.io/readme/badge/hypertrons/hypertrons-crx)](https://cla-assistant.io/hypertrons/hypertrons-crx)

</div>

`Hypercrx` project aims at tracing, digging and gaining insight into the projects and developers you're interested in. We do this by inserting useful dashboards into `GitHub` pages. `Hypercrx` provides an effective way for digital operations and analysis of open source community.

## Dashboards 🔥🔥🔥

You can find these dashboards in: 

<table>
	<tr>
		<th width="50%">
			<p>Entrance 1: GitHub User's Profile Page
			<p><img src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-perceptor-entrance-1.png">
			<p><img src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme_influence_location_dev.png">
		<th width="50%">
			<p>Entrance 2: GitHub Repository Page
			<p><img src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme_activity%26influence_location.png">
			<p><img src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-perceptor-entrance-2.png">
</table>

### Project Releated

<table>
	<tr>
		<th width="33%">
			<p> Project Correlation Network
			<p><img src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-prn.gif">
		<th width="33%">
			<p>Developer Collabration Network within Project
			<p><img src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-dcnp.gif">
		<th width="34%">
			<p>Project Activity & Influence Trend
			<p><img src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme_activity%26influence.gif">
</table>

- **Project Correlation Network**: Project Correlation Network shows the correlation between projects for a given time period. From this graph you can find the projects that are related to the given project.

- **Developer Collabration Network within project**: Developer Collabration Network within project shows the collaboration between active developers within the project for a given time period. From this graph you can find the active developers in the given project. What's more, you can find the collaborative relationships between these developers.

- **Project Activity & Influence Trend**: Project Activity & Influence Trend graph depicts the change in activity and influence since the project's inception. You can select one of the metrics to view, and switch the timeline to see the full change in the metrics or focus on the most recent months of data.


### Developer Releated

<table>
	<tr>
		<th width="33%">
			<p>Developer Collabration Network
			<p><img src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-dcn.gif">
		<th width="33%">
			<p>Developer's Most Participated Repos
			<p><img src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-dmpr.gif">
		<th width="34%">
			<p>Developer's Activity & Influence Trend
			<p><img src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme_activity%26influence.gif">
</table>

- **Developer Collabration Network**: Developer Collaboration Network shows the collaboration between developers for a given time period. From this graph you can find other developers who are closet to a given developer.
- **Developer's Most Participated Repos**: Developer's Most Participated Repos shows the active projects of developers in a given time period. From this graph you can find out the most active repositories for a given developer.
- **Developer's Activity & Influence Trend**：The Developer Activity and Influence Trend chart depicts changes in developer activity and influence from 15 years to the present. You can select one of the metrics to view, and switch the timeline to see an overview of all changes in the metrics or focus on the most recent months of data.

## Install

[link-chrome]: https://chrome.google.com/webstore/detail/hypercrx/ijchfbpdgeljmhnhokmekkecpbdkgabc 'Version published on Chrome Web Store'

[link-edge]:https://microsoftedge.microsoft.com/addons/detail/hypercrx/lbbajaehiibofpconjgdjonmkidpcome?hl=zh-CN

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] also compatible with [<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/edge/edge.svg" width="24" alt="Edge" valign="middle">][link-edge] [<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/opera/opera.svg" width="24" alt="Opera" valign="middle">][link-chrome]

For more information please refer to [Installation Guide](./INSTALLATION.md).

## Contributing

### Quickstart

```bash
git clone https://github.com/hypertrons/hypertrons-crx
cd hypertrons-crx
npm install
npm run watch
npm run web-ext
```

[web-ext](https://github.com/mozilla/web-ext) would open `Chrome` and load `Hypertrons-crx` into the browser automatically. And the default configuration of `web-ext` can be found in [package.json](https://github.com/hypertrons/hypertrons-crx/blob/master/package.json):

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
