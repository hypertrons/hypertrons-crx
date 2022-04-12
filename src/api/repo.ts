import { HYPERTRONS_OSS_XLAB_ENDPOINT, OSS_XLAB_ENDPOINT } from '../constant';
import request, { mockSuccessRes } from '../utils/request';
import { repoCorrelationData, developersByRepo } from '../mock/repo.data';

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
