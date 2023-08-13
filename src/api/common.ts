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

const metaCache = new Map<string, Promise<Response>>();
/**
 * Check if the repo/user has meta data in OpenDigger
 * e.g. https://oss.x-lab.info/open_digger/github/X-lab2017/open-digger/meta.json (repo meta file)
 * e.g. https://oss.x-lab.info/open_digger/github/tyn1998/meta.json (user meta file)
 * @param name repo name or user name
 */
export const hasMeta = async (name: string) => {
  let promise: Promise<Response>;
  if (!metaCache.has(name)) {
    const url = `${OSS_XLAB_ENDPOINT}/open_digger/github/${name}/meta.json`;
    promise = fetch(url);
    metaCache.set(name, promise);
  }
  const response = await metaCache.get(name)!;
  if (!response.ok) {
    return false;
  } else {
    return true;
  }
};
