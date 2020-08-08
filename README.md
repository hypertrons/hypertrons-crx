# Hypertrons Chrome Extension

This project is Hypertrons Chrome extension which help users to improve their user experience of Hypertrons.

## Functions

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
