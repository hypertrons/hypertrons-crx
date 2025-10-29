import React from 'react';
import * as echarts from 'echarts';
import { Button, Rate } from 'antd';
import { getRepoName } from '../../../../helpers/get-github-repo-info';
import { createRoot } from 'react-dom/client';

interface Props {
  activity: [string, number][];
  openrank: [string, number][];
  attention: [string, number][];
  participant: [string, number][];
  contributor: [string, number][];
  meta: any;
  // 修改 1: 在 ratings 属性的键名后添加 '?'，使其变回可选的 prop
  ratings?: {
    openrank?: number;
    activity?: number;
    attention?: number;
    contributor?: number;
    participant?: number;
  };
}

const AnalysisView: React.FC<Props> = ({
  activity,
  openrank,
  attention,
  participant,
  contributor,
  meta,
  // 修改 2: 为 ratings prop 提供一个默认的空对象 {}
  // 这样即使父组件不传递 ratings，代码也不会因 'undefined' 而报错。
  ratings = {},
}) => {
  const repoName = getRepoName();
  const chartRefs = {
    activity: React.useRef<HTMLDivElement>(null),
    openrank: React.useRef<HTMLDivElement>(null),
    attention: React.useRef<HTMLDivElement>(null),
    participant: React.useRef<HTMLDivElement>(null),
    contributor: React.useRef<HTMLDivElement>(null),
  };

  const chartsRef = React.useRef<echarts.ECharts[]>([]);

  const createChartOption = (data: [string, number][], title: string, color: string) => {
    const recentMonths = data.slice(-12);
    const monthlyData = recentMonths.map((item) => item[1]);
    const monthLabels = recentMonths.map((item) => {
      const [, month] = item[0].split('-');
      return `${parseInt(month, 10)}月`;
    });

    return {
      title: {
        text: title,
        textStyle: { fontSize: 14, fontWeight: 'normal' },
        left: '15px',
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const dataIndex = params[0].dataIndex;
          const [year, month] = recentMonths[dataIndex][0].split('-');
          return `${year}年${month}月: ${params[0].value.toFixed(2)}`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: monthLabels,
        boundaryGap: false,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      series: [
        {
          type: 'line',
          data: monthlyData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: color,
          },
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: `${color}4D`,
              },
              {
                offset: 1,
                color: `${color}1A`,
              },
            ]),
          },
        },
      ],
    };
  };

  const initializeCharts = React.useCallback(() => {
    chartsRef.current.forEach((chart) => {
      chart?.dispose();
    });
    chartsRef.current = [];

    const chartConfigs = [
      {
        ref: chartRefs.openrank,
        data: openrank,
        title: 'OpenRank',
        color: '#4ECDC4',
        rating: ratings.openrank,
      },
      {
        ref: chartRefs.activity,
        data: activity,
        title: '贡献活跃度',
        color: '#FF6B6B',
        rating: ratings.activity,
      },
      {
        ref: chartRefs.attention,
        data: attention,
        title: '用户欢迎度',
        color: '#45B7D1',
        rating: ratings.attention,
      },
      {
        ref: chartRefs.contributor,
        data: contributor,
        title: '支持响应度',
        color: '#96CEB4',
        rating: ratings.contributor,
      },
    ];

    chartConfigs.forEach((config) => {
      if (config.ref.current && config.data?.length) {
        const oldRateContainer = config.ref.current.querySelector('.rate-container');
        if (oldRateContainer) {
          oldRateContainer.parentElement?.removeChild(oldRateContainer);
        }

        const chart = echarts.init(config.ref.current);
        chart.setOption(createChartOption(config.data, config.title, config.color));

        if (config.rating !== undefined) {
          const rateContainer = document.createElement('div');
          rateContainer.className = 'rate-container';
          rateContainer.style.position = 'absolute';
          rateContainer.style.left = '100px';
          rateContainer.style.top = '3px';
          rateContainer.style.display = 'flex';
          rateContainer.style.alignItems = 'center';
          rateContainer.style.gap = '4px';
          config.ref.current.style.position = 'relative';
          config.ref.current.appendChild(rateContainer);

          const root = createRoot(rateContainer);
          root.render(
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Rate
                allowHalf
                defaultValue={config.rating}
                disabled
                style={{
                  fontSize: '15px',
                  color: '#ffcc00',
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  color: '#666',
                  marginLeft: '4px',
                }}
              >
                {config.rating.toFixed(1)}
              </span>
            </div>
          );
        }

        chartsRef.current.push(chart);
      }
    });
  }, [activity, openrank, attention, contributor, ratings]);

  React.useEffect(() => {
    initializeCharts();

    const handleResize = () => {
      chartsRef.current.forEach((chart) => {
        chart?.resize();
      });
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    Object.values(chartRefs).forEach((ref) => {
      if (ref.current) {
        resizeObserver.observe(ref.current);
      }
    });

    return () => {
      chartsRef.current.forEach((chart) => {
        chart?.dispose();
      });
      chartsRef.current = [];
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [initializeCharts]);

  // 添加点击处理函数
  const handleViewDetailedAnalysis = () => {
    const repoNameOnly = repoName.split('/')[1]; // 获取仓库名称部分（去掉owner）

    // 准备要传递的数据
    const analysisData = {
      repoName: repoName,
      activity,
      openrank,
      attention,
      contributor,
      participant,
      meta,
      ratings,
      timestamp: Date.now(),
    };

    // 将数据编码到URL参数中
    const encodedData = encodeURIComponent(JSON.stringify(analysisData));
    const url = `http://localhost:5173/?repo=${repoNameOnly}&data=${encodedData}`;

    // 跳转到前端页面
    window.open(url, '_blank');
  };

  return (
    <div style={{ width: '800px', padding: '20px' }}>
      <div
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          {getRepoName().split('/')[1]} 项目分析
        </span>
        <span
          style={{
            fontSize: '12px',
            backgroundColor: '#fff2e8',
            color: '#ff4d4f',
            padding: '2px 8px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          近期火热🔥
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        <div ref={chartRefs.openrank} style={{ height: '250px' }} />
        <div ref={chartRefs.activity} style={{ height: '250px' }} />
        <div ref={chartRefs.attention} style={{ height: '250px' }} />
        <div ref={chartRefs.contributor} style={{ height: '250px' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={handleViewDetailedAnalysis}>
          查看详细分析
        </Button>
      </div>
    </div>
  );
};

export default AnalysisView;
