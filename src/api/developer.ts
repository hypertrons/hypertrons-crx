import request from '../utils/request';
import { mockSuccessResponse } from '../utils/utils';
import { developerCollabrationData, participatedProjectsData } from '../mock/developer.data';

export const getDeveloperCollabration = async (developer: string) => {
  return mockSuccessResponse(developerCollabrationData) || await request(`/actor/${developer}.json`);
}

export const getParticipatedProjects = async (developer: string) => {
  return mockSuccessResponse(participatedProjectsData) || await request(`/actor/${developer}_top.json`);
}