import { HYPERTRONS_OSS_XLAB_ENDPOINT, OSS_XLAB_ENDPOINT } from '../constant';
import request, { mockSuccessRes } from '../utils/request';
import { repoCorrelationData, developersByRepo } from '../mock/repo.data';

// metric names and their implementation names in OpenDigger
const metricNameMap = new Map([
  ['activity', 'activity'],
  ['openrank', 'openrank'],
]);

const getMetricByName = async (repo: string, metric: string) => {
  const res = await request(
    `${OSS_XLAB_ENDPOINT}/open_digger/github/${repo}/${metricNameMap.get(
      metric
    )}.json`
  );
  return res.data;
};

export const getActivity = async (repo: string) => {
  return await getMetricByName(repo, 'activity');
};

export const getOpenrank = async (repo: string) => {
  return await getMetricByName(repo, 'openrank');
};

export const getRepoDetail = async (repo: string) => {
  return await request(`${OSS_XLAB_ENDPOINT}/repo_detail/${repo}.json`);
};

// the two requests below will be deprecated once their OpenDigger implementations are ready
export const getRepoCorrelation = async (repo: string) => {
  return (
    mockSuccessRes(repoCorrelationData) ||
    (await request(`${HYPERTRONS_OSS_XLAB_ENDPOINT}/repo/${repo}.json`))
  );
};

export const getDevelopersByRepo = async (repo: string) => {
  return (
    mockSuccessRes(developersByRepo) ||
    (await request(`${HYPERTRONS_OSS_XLAB_ENDPOINT}/repo/${repo}_top.json`))
  );
};

export const getRepoActiInfl = async (repo: string) => {
  return await request(`${OSS_XLAB_ENDPOINT}/hypercrx_repo/${repo}.json`);
};
