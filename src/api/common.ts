import { OSS_XLAB_ENDPOINT, ErrorCode } from '../constant';
import request from '../helpers/request';

export const getMetricByName = async (
  owner: string,
  metricNameMap: Map<string, string>,
  metric: string
) => {
  try {
    return await request(
      `${OSS_XLAB_ENDPOINT}/open_digger/github/${owner}/${metricNameMap.get(
        metric
      )}.json`
    );
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
