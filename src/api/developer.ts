import { OSS_XLAB_ENDPOINT } from '../constant';
import request from '../utils/request';

// metric names and their implementation names in OpenDigger
const metricNameMap = new Map([
  ['activity', 'activity'],
  ['openrank', 'openrank'],
  ['developer_network', 'developer_network'],
  ['repo_network', 'repo_network'],
]);

const getMetricByName = async (user: string, metric: string) => {
  const res = await request(
    `${OSS_XLAB_ENDPOINT}/open_digger/github/${user}/${metricNameMap.get(
      metric
    )}.json`
  );
  return res.data;
};

export const getActivity = async (user: string) => {
  return getMetricByName(user, 'activity');
};

export const getOpenrank = async (user: string) => {
  return getMetricByName(user, 'openrank');
};

export const getDeveloperNetwork = async (user: string) => {
  return getMetricByName(user, 'developer_network');
};

export const getRepoNetwork = async (user: string) => {
  return getMetricByName(user, 'repo_network');
};
