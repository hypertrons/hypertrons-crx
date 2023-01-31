import { OSS_XLAB_ENDPOINT, ErrorCode } from '../constant';
import request from '../utils/request';

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
    // the catched error being "404" means the metric file is not available
    // returning an empty object makes follow-up data processing easier
    if (error === ErrorCode.NOT_FOUND) {
      return {};
    } else {
      // other errors should be throwed
      throw error;
    }
  }
};
