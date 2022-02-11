import request, { mockSuccessRes } from '../utils/request';
import { developerCollabrationData, participatedProjectsData } from '../mock/developer.data';

export const getDeveloperCollabration = async (developer: string) => {
  return mockSuccessRes(developerCollabrationData) || await request(`/actor/${developer}.json`);
}

export const getParticipatedProjects = async (developer: string) => {
  return mockSuccessRes(participatedProjectsData) || await request(`/actor/${developer}_top.json`);
}