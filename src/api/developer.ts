import { getMetricByName } from './common';

// metric names and their implementation names in OpenDigger
const metricNameMap = new Map([
  ['activity', 'activity'],
  ['openrank', 'openrank'],
  ['developer_network', 'developer_network'],
  ['repo_network', 'repo_network'],
]);

export const getActivity = async (user: string) => {
  return getMetricByName(user, metricNameMap, 'activity');
};

export const getOpenrank = async (user: string) => {
  return getMetricByName(user, metricNameMap, 'openrank');
};

export const getDeveloperNetwork = async (user: string) => {
  return getMetricByName(user, metricNameMap, 'developer_network');
};

export const getRepoNetwork = async (user: string) => {
  return getMetricByName(user, metricNameMap, 'repo_network');
};
