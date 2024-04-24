/**
 * 该模块负责在GitHub仓库页面中，增强贡献者列表的功能。
 * 它使用React来渲染贡献者列表，并通过API获取额外的网络数据。
 */

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import View from './view';
import { getRepoName } from '../../../../helpers/get-repo-info';
import {getDeveloperNetwork, getRepoNetwork} from "../../../../api/repo";
import features from '../../../../feature-manager';
import * as pageDetect from 'github-url-detection';
import elementReady from "element-ready";

// 全局变量用于存储仓库名称和网络数据，以便在不同函数间共享
// 定义全局变量，用于存储仓库名称和网络数据。
let repoName: string;
let developerNetworks: any;
let repoNetworks: any;
let target: any;

// 获取当前模块的特征ID，用于特性管理。
const featureId = features.getFeatureID(import.meta.url);

/**
 * 异步获取仓库开发者和仓库的网络数据。
 */
const getData = async () => {
  developerNetworks = await getDeveloperNetwork(repoName);
  repoNetworks = await getRepoNetwork(repoName);
};

/**
 * 替换贡献者列表为React组件。
 * @param target 要替换的目标元素。
 */
const replaceContributorList = (target: HTMLElement) => {
  const originalHTML = target.innerHTML;

  render(
    <React.Fragment>
      <View developerNetwork={developerNetworks} target={originalHTML} />
    </React.Fragment>,
    document.querySelector('.list-style-none.d-flex.flex-wrap.mb-n2') as HTMLElement
  );
};

/**
 * 初始化功能，包括获取仓库名称和数据，以及替换贡献者列表。
 */
const init = async (): Promise<void> => {
  repoName = getRepoName();
  const targetElement = document.querySelector('.list-style-none.d-flex.flex-wrap.mb-n2') as HTMLElement;
  await getData();
  replaceContributorList(targetElement);
};

/**
 * 在页面刷新或导航时恢复功能，重新加载数据和渲染列表。
 */
const restore = async () => {
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
    await getData();
  }
  $('div.ReactModalPortal').remove();
  replaceContributorList(target);
};


// 将功能添加到特性管理器中，配置初始化和恢复函数。
features.add(featureId, {
//   asLongAs: [pageDetect.isUserProfile],
  awaitDomReady: false,
    init,
  restore,
});
