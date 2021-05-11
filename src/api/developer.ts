import request from '../utils/request';
import { developerCollabrationData, participatedProjectsData } from '../mock/developer.data';

export const getDeveloperCollabration = async (developer: string) => {
  if (process.env.NODE_ENV !== 'production') {
    return developerCollabrationData;
  }
  return await request(`/actor/${developer}.json`);
}

export const getParticipatedProjects = async (developer: string) => {
  if (process.env.NODE_ENV !== 'production') {
    return participatedProjectsData;
  }
  return await request(`/actor/${developer}_top.json`);
}
