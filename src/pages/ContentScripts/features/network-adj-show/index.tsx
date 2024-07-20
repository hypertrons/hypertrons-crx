import features from '../../../../feature-manager';

import { render, Container } from 'react-dom';
import $ from 'jquery';
import isPerceptor from '../../../../helpers/is-perceptor';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { getRepoNetwork, getDeveloperNetwork } from '../../../../api/repo';
import React, { useEffect, useRef } from 'react';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let repoNetworks: any;
let developerNetworks: any;
let repoEdges: any;
let developerEdges: any;
const allNodes = new Set<string>();

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

function addTable(adjacentNodes, nodeListSpan) {
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';

  // 添加表头
  const headerRow = document.createElement('tr');
  const headerKey = document.createElement('th');
  headerKey.innerText = 'Related Repository';
  headerKey.style.border = '1px solid white';
  // headerKey.style.backgroundColor = '#f2f2f2';
  const headerValue = document.createElement('th');
  headerValue.innerText = 'Relation value';
  headerValue.style.border = '1px solid white';
  // headerValue.style.backgroundColor = '#f2f2f2';
  headerRow.appendChild(headerKey);
  headerRow.appendChild(headerValue);
  table.appendChild(headerRow);

  // 添加数据行
  adjacentNodes.forEach((item: [string, number]) => {
    const row = document.createElement('tr');
    const cellKey = document.createElement('td');
    cellKey.innerText = item[0];
    cellKey.style.border = '1px solid white';
    const cellValue = document.createElement('td');
    cellValue.innerText = item[1].toString();
    cellValue.style.border = '1px solid white';
    row.appendChild(cellKey);
    row.appendChild(cellValue);
    table.appendChild(row);
  });

  // 将表格插入到指定元素中
  for (const element of nodeListSpan) {
    element.innerHTML = '';
    element.appendChild(table);
  }
}

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();
  const con2 = document.getElementsByClassName('color-text-secondary-2');
  const text2 = con2[0].innerHTML;
  const con3 = document.getElementsByClassName('color-text-secondary-3');
  const text3 = con3[0].innerHTML;
  document.addEventListener('nodeHovered', function (event) {
    const nodeData = event.detail; // 获取节点数据
    const adjacentNodes = onHover(nodeData);
    // console.log(adjacentNodes)
    if (nodeData.includes('/')) {
      const nodeListSpan = document.getElementsByClassName('color-text-secondary-2');
      // const spanElements = adjacentNodes.map(item => `<span>${item}</span>`);
      // console.log(spanElements)
      // for (const element of nodeListSpan) {
      //     element.innerHTML = spanElements.join('<br>');

      // }
      addTable(adjacentNodes, nodeListSpan);
      document.addEventListener('mouseout', function () {
        // 恢复最初的文本
        nodeListSpan[0].innerHTML = text2;
      });
    } else {
      const nodeListSpan = document.getElementsByClassName('color-text-secondary-3');
      // const spanElements = adjacentNodes.map(item => `<span>${item}</span>`);
      // for (const element of nodeListSpan) {
      //     element.innerHTML = spanElements.join('<br>');
      // }
      addTable(adjacentNodes, nodeListSpan);
      document.addEventListener('mouseout', function () {
        // 恢复最初的文本
        nodeListSpan[0].innerHTML = text3;
      });
    }
  });
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
