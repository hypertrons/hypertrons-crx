import request from '../helpers/request';
import { ErrorCode, OSS_XLAB_ENDPOINT } from '../constant';

export const getMetricByDate = async (repoName: string, date: string) => {
  try {
    return await request(`${OSS_XLAB_ENDPOINT}/open_digger/github/${repoName}/project_openrank_detail/${date}.json`);
  } catch (error) {
    // the catched error being "404" means the metric file is not available so return a null
    if (error === ErrorCode.NOT_FOUND) {
      return null;
    } else {
      // other errors should be throwed
      throw error;
    }
  }
};

export const getOpenrank = async (repo: string, date: string) => {
  return getMetricByDate(repo, date);
};
