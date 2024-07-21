import features from '../../../../feature-manager';

import { render, Container } from 'react-dom';
import $ from 'jquery';
import isPerceptor from '../../../../helpers/is-perceptor';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { getRepoNetwork, getDeveloperNetwork } from '../../../../api/repo';
import React, { useEffect, useRef } from 'react';
import View from './view';
import ReactDOM from 'react-dom';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let repoNetworks: any;
let developerNetworks: any;
let repoEdges: any;
let developerEdges: any;

const getData = async () => {
  repoNetworks = await getRepoNetwork(repoName);
  developerNetworks = await getDeveloperNetwork(repoName);
  repoEdges = repoNetworks.edges;
  developerEdges = developerNetworks.edges;
};

function onHover(nodeName: string): [string, number][] {
  let adjacentNodes: [string, number][] = [];
  if (nodeName.includes('/')) {
    repoEdges.forEach((edge: [string, string, number]) => {
      if (edge[0] === nodeName && edge[2] >= 10) {
        adjacentNodes.push([edge[1], edge[2]]);
      } else if (edge[1] === nodeName && edge[2] >= 10) {
        adjacentNodes.push([edge[0], edge[2]]);
      }
    });
  } else {
    developerEdges.forEach((edge: [string, string, number]) => {
      if (edge[0] === nodeName && edge[2] >= 2.5) {
        adjacentNodes.push([edge[1], edge[2]]);
      } else if (edge[1] === nodeName && edge[2] >= 2.5) {
        adjacentNodes.push([edge[0], edge[2]]);
      }
    });
  }
  // console.log(adjacentNodes);
  return adjacentNodes;
}

const renderTo = (container: Element, adjacentNodes: [string, number][]) => {
  ReactDOM.render(<View adjacentNodes={adjacentNodes} />, container);
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();
  const con2 = document.getElementsByClassName('color-text-secondary-2');
  const text2 = con2[0].innerHTML;
  const con3 = document.getElementsByClassName('color-text-secondary-3');
  const text3 = con3[0].innerHTML;

  document.addEventListener('nodeHovered', function (event) {
    const customEvent = event as CustomEvent;
    const nodeData = customEvent.detail; // 获取节点数据
    const adjacentNodes = onHover(nodeData);
    if (nodeData.includes('/')) {
      const nodeListSpan = document.getElementsByClassName('color-text-secondary-2');
      renderTo(nodeListSpan[0], adjacentNodes);
      document.addEventListener('mouseout', function () {
        // 恢复最初的文本
        nodeListSpan[0].innerHTML = text2;
      });
    } else {
      const nodeListSpan = document.getElementsByClassName('color-text-secondary-3');
      renderTo(nodeListSpan[0], adjacentNodes);
      document.addEventListener('mouseout', function () {
        // 恢复最初的文本
        nodeListSpan[0].innerHTML = text3;
      });
    }
  });

  // document.addEventListener('nodeHovered', function (event) {
  //   const customEvent = event as CustomEvent;
  //   const nodeData = customEvent.detail; // 获取节点数据
  //   const adjacentNodes = onHover(nodeData);
  //   if (nodeData.includes('/')) {
  //     const nodeListSpan = document.getElementsByClassName('color-text-secondary-2');
  //     renderTo(nodeListSpan[0], adjacentNodes);
  //   } else {
  //     const nodeListSpan = document.getElementsByClassName('color-text-secondary-3');
  //     renderTo(nodeListSpan[0], adjacentNodes);
  //   }
  // });

  // document.addEventListener('nodeHoverOut', function (event) {
  //   const customEvent = event as CustomEvent;
  //   const nodeData = customEvent.detail;
  //   if (nodeData.includes('/')) {
  //     const nodeListSpan = document.getElementsByClassName('color-text-secondary-2');
  //     nodeListSpan[0].innerHTML = text2;
  //   } else {
  //     const nodeListSpan = document.getElementsByClassName('color-text-secondary-3');
  //     nodeListSpan[0].innerHTML = text3;
  //   }
  // });
};

const restore = async () => {
  console.log('2222222222222');
};

features.add(featureId, {
  asLongAs: [isPerceptor, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
