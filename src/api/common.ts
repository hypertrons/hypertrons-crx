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

/**
 * Common interface for both repo meta and user meta
 * e.g. https://oss.x-lab.info/open_digger/github/X-lab2017/open-digger/meta.json (repo meta file)
 * e.g. https://oss.x-lab.info/open_digger/github/tyn1998/meta.json (user meta file)
 * @param name repo name or user name
 */
interface CommonMeta {
  type: 'user' | 'repo';
  updatedAt: number; // time stamp
  labels: unknown[]; // TODO: define the type
}

interface RepoMeta extends CommonMeta {}

interface UserMeta extends CommonMeta {
  repos: unknown[];
}

class MetaStore {
  private static instance: MetaStore;
  private responseCache: Map<string, Promise<Response>>;
  private constructor() {
    this.responseCache = new Map<string, Promise<Response>>();
  }

  public static getInstance(): MetaStore {
    if (!MetaStore.instance) {
      MetaStore.instance = new MetaStore();
    }
    return MetaStore.instance;
  }

  /**
   * Fetch the meta file and cache the response
   * @param name repo name or user name
   */
  private fetchMeta(name: string) {
    const url = `${OSS_XLAB_ENDPOINT}/open_digger/github/${name}/meta.json`;
    const promise = fetch(url);
    this.responseCache.set(name, promise);
  }

  /**
   * Check if the meta file exists
   * @param name repo name or user name
   * @returns true if the meta file exists, false otherwise
   */
  public async has(name: string) {
    if (!this.responseCache.has(name)) {
      this.fetchMeta(name);
    }
    const response = await this.responseCache.get(name)!;
    if (!response.ok) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Get the parsed meta file if it exists
   * @param name repo name or user name
   * @returns the parsed meta file if it exists, undefined otherwise
   */
  public async get(name: string): Promise<CommonMeta | undefined> {
    if (await this.has(name)) {
      const meta: CommonMeta = await this.responseCache
        .get(name)!
        .then((res) => res.json());
      return meta;
    }
  }
}

export const metaStore = MetaStore.getInstance();
