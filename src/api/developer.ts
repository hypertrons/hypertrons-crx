import { getMetricByName } from './common';

// metric names and their implementation names in OpenDigger
const metricNameMap = new Map([
  ['activity', 'activity'],
  ['openrank', 'openrank'],
  ['developer_network', 'developer_network'],
  ['repo_network', 'repo_network'],
]);

export const getActivity = async (platform: string, user: string) => {
  return getMetricByName(platform, user, metricNameMap, 'activity');
};

export const getOpenrank = async (platform: string, user: string) => {
  return getMetricByName(platform, user, metricNameMap, 'openrank');
};

export const getDeveloperNetwork = async (platform: string, user: string) => {
  return getMetricByName(platform, user, metricNameMap, 'developer_network');
};

export const getRepoNetwork = async (platform: string, user: string) => {
  return getMetricByName(platform, user, metricNameMap, 'repo_network');
};
