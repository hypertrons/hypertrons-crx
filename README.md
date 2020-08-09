# Hypertrons Chrome Extension

This project is Hypertrons Chrome extension which help users to improve their user experience of Hypertrons.

## Quick Start

### Install

```bash
$ git clone git@github.com:hypertrons/hypertrons-crx.git
$ cd hypertrons-crx
$ npm install
$ npm start
```

Open your browser and visit http://127.0.0.1:3000 . You can see some `popup` pages and even `content` pages.

### Build

```bash
$ npm run build
```

The output files are under `build` directory. Now you can [load it into the browser](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/#google-chrome-opera-vivaldi).

### How to run test

We use [`Jest`](https://jestjs.io/) to do unit test. All of the test files are under [`test`](./test) directory.

```bash
$ npm run test
```

#### VSCode Extension

If you use `VSCode`, it's recommended to install [vscode-jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) extension to get a comprehensive experience. It provides:

- Useful IDE based Feedback
- Session based test watching

## Features

The main purpose of this project is to enhance Chrome to show dashboard and commandline on web pages of certain hosting service like GitHub, GitLab and Gitee. And this extension is used to

### Welcome information

In the first `div` of the `hypertrons-mini-dashboard`, you can setup your own welcome information to developers visit your front page. The default information is `Hello, ${user-login}, welcome to ${repo-name}. You are ${role} of this repo.`.

### Dashboard

There are two kinds of default dashboard components supported, `line chart` and `table`.

#### Line chart

We use simple `echarts` library to support chart functions. So you can refer to `echarts` documentation to checkout how to use it to customize your own charts.

You can set simple data to `line chart` to get a default dashboard component.

#### Table

You can set simple data to `table` component to get a default dashboard component.

### Commandline

After user setup his platform token, the `commandline` will turn on. User can use commandline to send valid command to Hypertrons backend to interact with other platforms or automation process.
