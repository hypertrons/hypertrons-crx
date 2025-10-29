import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const OverviewChart = ({ repo, analysisData }) => {
  const [chartData, setChartData] = useState({
    openrankData: [],
    activityData: [],
    issueCommentsData: [],
    attentionData: [],
  });
  const [aiResult, setAiResult] = useState(''); // AI分析结果
  const [loading, setLoading] = useState(false);

  const filterLastYearData = (data) => {
    if (!data || data.length === 0) return [];
    const now = new Date();
    const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
    return data.filter((item) => {
      const itemDate = new Date(item[0]);
      return itemDate >= oneYearAgo;
    });
  };

  useEffect(() => {
    if (analysisData) {
      const activityData = analysisData.activity || [];
      const openrankData = analysisData.openrank || [];
      const participantData = analysisData.participant || [];
      const attentionData = analysisData.attention || [];
      setChartData({
        openrankData: filterLastYearData(openrankData),
        activityData: filterLastYearData(activityData),
        issueCommentsData: filterLastYearData(participantData),
        attentionData: filterLastYearData(attentionData),
      });
    } else {
      setChartData({
        openrankData: [],
        activityData: [],
        issueCommentsData: [],
        attentionData: [],
      });
    }
  }, [analysisData]);

  // 发送数据到后端AI
  const handleAnalyze = async () => {
    setLoading(true);
    setAiResult('');
    try {
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: analysisData.repoName,
          openrank: analysisData.openrank,
          activity: analysisData.activity,
          participant: analysisData.participant,
          attention: analysisData.attention,
        }),
      });
      const data = await response.json();
      setAiResult(data.analysisReport || 'AI无返回内容');
    } catch (e) {
      setAiResult('AI分析请求失败：' + e.message);
    }
    setLoading(false);
  };

  const option = {
    title: { text: '概览', left: '20px', top: '20px' },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let result = params[0].axisValue + '<br/>';
        params.forEach((param) => {
          result += param.marker + ' ' + param.seriesName + ': ' + param.value[1].toFixed(2) + '<br/>';
        });
        return result;
      },
    },
    legend: {
      data: ['OpenRank指数', '贡献活跃度', '社区服务与支撑', '用户欢迎度'],
      top: '20px',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.activityData.map((item) => item[0]),
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: { type: 'dashed' },
      },
    },
    series: [
      {
        name: 'OpenRank指数',
        type: 'line',
        data: chartData.openrankData.map((item) => [item[0], item[1]]),
        smooth: true,
        symbol: 'none',
        itemStyle: { color: '#5470c6' },
      },
      {
        name: '贡献活跃度',
        type: 'line',
        data: chartData.activityData.map((item) => [item[0], item[1]]),
        smooth: true,
        symbol: 'none',
        itemStyle: { color: '#91cc75' },
      },
      {
        name: '社区服务与支撑',
        type: 'line',
        data: chartData.issueCommentsData.map((item) => [item[0], item[1]]),
        smooth: true,
        symbol: 'none',
        itemStyle: { color: '#fac858' },
      },
      {
        name: '用户欢迎度',
        type: 'line',
        data: chartData.attentionData.map((item) => [item[0], item[1]]),
        smooth: true,
        symbol: 'none',
        itemStyle: { color: '#ee6666' },
      },
    ],
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
      <ReactECharts option={option} style={{ height: '400px' }} opts={{ renderer: 'svg' }} />
      {/* AI分析按钮和结果展示框 */}
      <div style={{ marginTop: 32 }}>
        <button
          onClick={handleAnalyze}
          disabled={loading || !analysisData}
          style={{
            padding: '8px 20px',
            fontSize: 16,
            borderRadius: 6,
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'AI分析中...' : 'AI智能分析'}
        </button>
        <div
          style={{
            marginTop: 16,
            minHeight: 120,
            background: '#f7f7f7',
            borderRadius: 8,
            padding: 16,
            color: '#333',
            fontSize: 16,
            whiteSpace: 'pre-wrap',
          }}
        >
          {aiResult || '（AI分析结果将在这里显示）'}
        </div>
      </div>
    </div>
  );
};

export default OverviewChart;
