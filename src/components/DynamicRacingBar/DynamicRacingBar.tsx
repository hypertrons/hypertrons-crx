import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import * as React from 'react';
import PlayButton from './DynamicRacingBarin/PlayButton';
import { getGithubTheme } from '../../utils/utils';
import {
  DynamicBarData,
  DynamicBardata,
} from '../../mock/DynamicRacingBar.data';

const LIGHT_THEME = {
  FG_COLOR: '#24292f',
  BG_COLOR: '#ffffff',
  PALLET: ['#5470c6', '#91cc75'],
};
const DARK_THEME = {
  FG_COLOR: '#c9d1d9',
  BG_COLOR: '#0d1118',
  PALLET: ['#58a6ff', '#3fb950'],
};
const githubTheme = getGithubTheme();
interface DynamicBarProps {
  dataURL: string;
}
let username: string[] = [];
let time: string[] = [];
let value: number[] = [];
for (let i = 0; i < 7; i++) {
  username.push(DynamicBardata.username[i]);
  time.push(DynamicBarData.contribution[i].date);
  value.push(DynamicBarData.contribution[i].value);
}
const years: string[] = [];
const DynamicRacingBar: React.FC<DynamicBarProps> = (props) => {
  const { dataURL } = props;
  const [play, setPlay] = useState(true);
  const divEL = useRef(null);
  const [CSVData, setCSVData] = useState();
  const TH = githubTheme == 'light' ? LIGHT_THEME : DARK_THEME;

  const data: number[] = [];

  const option: echarts.EChartsOption = {
    xAxis: {
      max: 'dataMax',
    },
    yAxis: {
      type: 'category',
      data: username,
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      max: DynamicBardata.username.length,
    },
    series: [
      {
        realtimeSort: true,
        name: 'X',
        type: 'bar',
        data: data,
        label: {
          show: true,
          position: 'right',
          valueAnimation: true,
        },
      },
    ],
    legend: {
      show: true,
    },
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
  };

  function run() {
    for (var i = 0; i < data.length; ++i) {
      if (i === 0) {
        continue;
      }
      if (Math.random() > 0.9) {
        data[i] += Math.round(Math.random() * 20);
      } else {
        data[i] += Math.round(Math.random() * 2);
      }
    }
    if (data.length < 10) {
      data.push(10);
    } else {
      data.splice(0, 1);
    }
    let chartDOM = divEL.current;
    const instance = echarts.getInstanceByDom(chartDOM as any);

    if (instance) {
      instance.setOption(option);
    }
  }
  setTimeout(function () {
    run();
  }, 0);
  setInterval(function () {
    run();
    let chartDOM = divEL.current;
    const instance = echarts.init(chartDOM as any);

    return () => {
      instance.dispose();
    };
  }, 3000);

  useEffect(() => {
    let chartDOM = divEL.current;
    const instance = echarts.init(chartDOM as any);

    return () => {
      instance.dispose();
    };
  }, []);
  function settingplay() {
    if (play === true) {
      setPlay(false);
    } else if (play === false) {
      setPlay(true);
    }
  }
  return (
    <div>
      <button
        onClick={settingplay}
        style={{ marginLeft: '690px', marginTop: '5px' }}
      >
        Play
      </button>
      <div ref={divEL} style={{ width: '800px', height: '450px' }}></div>
    </div>
  );
};

export default DynamicRacingBar;
