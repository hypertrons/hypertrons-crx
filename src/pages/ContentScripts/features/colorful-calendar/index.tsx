import features from '../../../../feature-manager';
import waitFor from '../../../../helpers/wait-for';

import React from 'react';
import { render } from 'react-dom';
import { ColorPicker } from 'antd';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

import './index.scss'; // 需要引入自定义的样式来覆盖antd ColorPicker的默认样式，后面展开说明

const featureId = features.getFeatureID(import.meta.url);

let colors = ['#ebedf0', '#ffedf9', '#ffc3eb', '#ff3ebf', '#c70085'];

const changeLevelColor = async (level: number, color: string) => {
    const root = document.documentElement;
    if (level === 0) {
        root.style.setProperty(`--color-calendar-graph-day-bg`, color);
    } else {
        root.style.setProperty(`--color-calendar-graph-day-L${level}-bg`, color);
    }
    // Save to storage
    const newColors = [...colors];
    newColors[level] = color;
    await chrome.storage.local.set({
        calendar_level_colors: newColors,
    });
};

const replaceLegendToColorPicker = async (level: number, defaultColor: string) => {
    const legendSelector = `#contribution-graph-legend-level-${level}`; // 选择器selector是用于定位DOM元素的字符串
    await waitFor(() => $(legendSelector).length > 0); // init函数运行的时候，页面中某些元素不一定已经加载完毕，经过测试，日历图加载时机比较靠后，因此需要waitFor一下，不然后面的操作都是无用的
    const $legend = $(legendSelector);
    const container = $('<div></div>');
    render(
        <ColorPicker defaultValue={defaultColor} size="small" onChange={(color, hex) => changeLevelColor(level, hex)} />, // 选择新颜色后会调用changeLevelColor改变格子颜色
        container[0]
    ); // 将React组件渲染为真实的DOM元素
    $legend.replaceWith(container); // 使用jQuery的replaceWith方法将图例格子替换为ColorPicker
};

const init = async (): Promise<void> => {
    // Load colors from storage
    colors =
        (await chrome.storage.local.get('calendar_level_colors'))[
        'calendar_level_colors'
        ] || colors;

    for (let i = 0; i < colors.length; i++) {
        changeLevelColor(i, colors[i]);
        replaceLegendToColorPicker(i, colors[i]);
    }
};
const restore = async () => {
    console.log('restore colorful-calendar');
};

features.add(featureId, {
    asLongAs: [pageDetect.isUserProfile],
    awaitDomReady: false,
    init,
    restore,
});