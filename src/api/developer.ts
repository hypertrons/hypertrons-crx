import { HYPERTRONS_OSS_XLAB_ENDPOINT, OSS_XLAB_ENDPOINT } from '../constant';
import request, { mockSuccessRes } from '../utils/request';
import {
  developerCollabrationData,
  participatedProjectsData,
} from '../mock/developer.data';

export const getDeveloperCollabration = async (developer: string) => {
  return (
    mockSuccessRes(developerCollabrationData) ||
    (await request(`${HYPERTRONS_OSS_XLAB_ENDPOINT}/actor/${developer}.json`))
  );
};

export const getParticipatedProjects = async (developer: string) => {
  return (
    mockSuccessRes(participatedProjectsData) ||
    (await request(
      `${HYPERTRONS_OSS_XLAB_ENDPOINT}/actor/${developer}_top.json`
    ))
  );
};

export const getDeveloperActiInfl = async (developer: string) => {
  return await request(`${OSS_XLAB_ENDPOINT}/hypercrx_actor/${developer}.json`);
};
