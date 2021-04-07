import { minMaxRange } from '../utils/utils';

export const getGraphData = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();

  data.nodes.forEach((node: any) => {
    node['symbolSize'] = node.value;
    node['itemStyle'] = {
      color: '#28a745'
    };
  });
  minMaxRange(data.nodes, 'symbolSize', 10, 50);
  data.edges.forEach((edge: any) => {
    edge['value'] = edge.weight;
  });
  minMaxRange(data.edges, 'weight', 1, 10);
  data.edges.forEach((edge: any) => {
    edge['lineStyle'] = {
      width: edge.weight,
      color: 'green'
    };
  });

  return data;
}