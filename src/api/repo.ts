import request from '../utils/request';
import { repoCorrelationData, developersByRepo } from '../mock/repo.data';

export const getRepoCorrelation = async (repo: string) => {
  if (process.env.NODE_ENV !== 'production') {
    return repoCorrelationData;
  }
  return await request(`/repo/${repo}.json`);
}

export const getDevelopersByRepo = async (repo: string) => {
  if (process.env.NODE_ENV !== 'production') {
    return developersByRepo;
  }
  return await request(`/repo/${repo}_top.json`);
}
