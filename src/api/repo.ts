import request, { mockSuccessRes } from '../utils/request';
import { repoCorrelationData, developersByRepo } from '../mock/repo.data';

export const getRepoCorrelation = async (repo: string) => {
  return (
    mockSuccessRes(repoCorrelationData) || (await request(`/repo/${repo}.json`))
  );
};

export const getDevelopersByRepo = async (repo: string) => {
  return (
    mockSuccessRes(developersByRepo) ||
    (await request(`/repo/${repo}_top.json`))
  );
};

export const getRepoActiInfl = async (repo: string) => {
  return await request(`/activity_influence/repos/${repo}.json`);
};
