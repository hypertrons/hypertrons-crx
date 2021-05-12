import request from '../utils/request';
import { mockSuccessResponse } from '../utils/utils';
import { repoCorrelationData, developersByRepo } from '../mock/repo.data';

export const getRepoCorrelation = async (repo: string) => {
  return mockSuccessResponse(repoCorrelationData) || await request(`/repo/${repo}.json`);
}

export const getDevelopersByRepo = async (repo: string) => {
  return mockSuccessResponse(developersByRepo) || await request(`/repo/${repo}_top.json`);
}