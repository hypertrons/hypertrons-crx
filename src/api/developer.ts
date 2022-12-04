import { HYPERTRONS_OSS_XLAB_ENDPOINT, OSS_XLAB_ENDPOINT } from '../constant';
import request from '../utils/request';

// metric names and their implementation names in OpenDigger
const metricNameMap = new Map([
  ['activity', 'activity'],
  ['openrank', 'openrank'],
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

// the two requests below will be deprecated once their OpenDigger implementations are ready
export const getDeveloperCollabration = async (developer: string) => {
  return await request(
    `${HYPERTRONS_OSS_XLAB_ENDPOINT}/actor/${developer}.json`
  );
};

export const getParticipatedProjects = async (developer: string) => {
  return await request(
    `${HYPERTRONS_OSS_XLAB_ENDPOINT}/actor/${developer}_top.json`
  );
};
