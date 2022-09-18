import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import * as React from 'react';
import PlayButton from './DynamicRacingBarin/PlayButton';
import { getGithubTheme } from '../../utils/utils';
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
  height: number;
  legend1: string;
  legend2: string;
  yName1: string;
  yName2: string;
  data1: [string, number][];
  data2: [string, number][];
}
const [playing, setPlaying] = useState(false);
const dimension = 0;
const DynamicRacingBar: React.FC<DynamicBarProps> = (props) => {
  const { height, legend1, legend2, yName1, yName2, data1, data2 } = props;

  const divEL = useRef(null);
  const TH = githubTheme == 'light' ? LIGHT_THEME : DARK_THEME;
  const option: echarts.EChartsOption = {
    grid: {
      top: 10,
      bottom: 30,
      left: 150,
      right: 80,
    },
    xAxis: {
      max: 'dataMax',
      axisLabel: {
        formatter: function (n: number) {
          return Math.round(n) + '';
        },
      },
    },
    dataset: {
      // source: data1.slice(1).filter(function (d: string[]) {
      // return d[4] === startYear;
      // })
    },
    yAxis: {
      type: 'category',
      inverse: true,
      max: 10,
      axisLabel: {
        show: true,
        fontSize: 14,
        formatter: function (value: any) {
          // return value + '{flag|' + getFlag(value) + '}';
          return value;
        },
        rich: {
          flag: {
            fontSize: 25,
            padding: 5,
          },
        },
      },
      animationDuration: 300,
      animationDurationUpdate: 300,
    },
    series: [
      {
        realtimeSort: true,
        seriesLayoutBy: 'column',
        type: 'bar',
        itemStyle: {
          // color: function (param) {
          // return countryColors[(param.value as number[])[3]] || '#5470c6';
          // }
          color: 'red',
        },
        encode: {
          x: dimension,
          y: 3,
        },
        label: {
          show: true,
          precision: 1,
          position: 'right',
          valueAnimation: true,
          fontFamily: 'monospace',
        },
      },
    ],
  };

  useEffect(() => {
    let chartDOM = divEL.current;
    const instance = echarts.init(chartDOM as any);

    return () => {
      instance.dispose();
    };
  }, []);

  useEffect(() => {
    let chartDOM = divEL.current;
    const instance = echarts.getInstanceByDom(chartDOM as any);
    if (instance) {
      instance.setOption(option);
    }
  }, []);

  return (
    <div>
      {/* <PlayButton
        hide={playing}
        theme={theme}
        size={dateLabelSize * 0.8}
        play={play}
      /> */}
      <div ref={divEL} style={{ width: '100%', height: '500px' }}></div>;
    </div>
  );
};

const tooltipFormatter = (params: any) => {
  let res = `${params.seriesName} (${params.data[0]})<br/>
  ${params.marker}  ${params.data[1]}`;
  return res;
};

const formatNum = (num: number, index: number) => {
  let si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    // { value: 1e6, symbol: "M" },
  ];
  let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(2).replace(rx, '$1') + si[i].symbol;
};

export default DynamicRacingBar;
